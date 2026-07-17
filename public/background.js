console.log("[i] Extension background service worker is running");

const ENV = "dev";
const API_URL = "https://server.coredata.pl";
const API_USER_ROLE = "user";
let isRefreshing = false;
let isGeolocating = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

async function handleLogout(reason) {
  await chrome.storage.local.remove(["accessToken", "refreshToken", "account"]);
  chrome.runtime
    .sendMessage({ action: "session_expired", reason })
    .catch(() => {});
  log(`Logged out ${reason ? `for reason: ${reason}` : ""}`);
}

async function fetchWithTimeout(url, options = {}) {
  const { timeout = 10000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(timer);

  return response;
}

async function fetchAuthenticated(url, options = {}) {
  const storage = await chrome.storage.local.get([
    "accessToken",
    "refreshToken",
  ]);

  if (!storage.accessToken) {
    log("Authenticated fetch attempt with no auth token");
    return { status: 401, message: "No auth token" };
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${storage.accessToken}`,
  };

  const response = await fetchWithTimeout(url, options);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          options.headers.Authorization = `Bearer ${newToken}`;
          resolve(fetch(url, options));
        });
      });
    }

    isRefreshing = true;

    try {
      const newTokens = await refreshTokens(storage.refreshToken);

      await chrome.storage.local.set({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      isRefreshing = false;
      onRefreshed(newTokens.accessToken);

      options.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return fetchWithTimeout(url, options);
    } catch (error) {
      isRefreshing = false;
      refreshSubscribers = [];
      log("Authenticated fetch failed", error);
      await handleLogout("auth_failed");
      throw new Error("Session expired");
    }
  }

  return response;
}

async function sendRequest(endpoint, method, body) {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    timeout: 5000,
  };

  try {
    const response = await fetchAuthenticated(url, options);

    if (response.status === 401) {
      await handleLogout("tokens_expired");
      return { success: false, result: "Request unauthorized" };
    }

    const result = await response.json();

    return { success: response.ok, result };
  } catch (error) {
    log("Send request failed", error);
    throw new Error(`Send request failed. ${error.message}`);
  }
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new Error("No refresh token");

  const response = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return { success: false, result: "Refreshing auth tokens failed" };
  }

  return response.json(); // { accessToken, refreshToken }
}

async function register(email, password, displayname) {
  const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayname, role: API_USER_ROLE }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return { success: false, result: "Account already exists" };
    }
    return { success: false, result: "Registration failed" };
  }

  return { success: true, result: "Registration successful" };
}

async function login(email, password) {
  const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { success: false, result: "Login failed" };
  }

  const result = await response.json();

  if (!result.accessToken?.length || !result.refreshToken?.length) {
    return { success: false, result: "No auth tokens" };
  }

  await chrome.storage.local.set({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  const account = await getAccountData(email);
  const accountData = account.success
    ? account.result
    : {
        email,
        displayName: email,
        createdAt: "",
      };

  return {
    success: true,
    result: accountData,
  };
}

async function getAccountData(email) {
  const route = `/user/${email}`;
  const method = "GET";

  try {
    const response = await sendRequest(route, method);

    if (!response.success) {
      return {
        success: false,
        result: `Fetch user data failed. ${response.result}`,
      };
    }

    const account = {
      email: response.result.email,
      displayName: response.result.displayname,
      createdAt: response.result.createdAt,
    };

    await chrome.storage.local.set({ account });

    return { success: true, result: account };
  } catch (error) {
    return { success: false, result: error };
  }
}

async function sendNotification(data) {
  const storage = await chrome.storage.local.get(["account"]);

  if (!storage.account?.email) {
    return { success: false, result: "Undefined account email" };
  }

  const route = "/email/send";
  const method = "POST";
  const body = JSON.stringify({
    recipient: storage.account.email,
    subject: `BoardApp Notifications`,
    template: "boardapp-notification",
    templateData: {
      displayName: storage.account.displayName,
      notifications: data.notifications,
    },
  });

  try {
    const response = await sendRequest(route, method, body);
    return response;
  } catch (error) {
    return { success: false, result: error };
  }
}

async function geolocation() {
  if (isGeolocating) return;

  const route = "/geolocation";
  const method = "GET";
  isGeolocating = true;

  try {
    const response = await sendRequest(route, method);
    isGeolocating = false;

    if (!response.success) {
      return {
        success: false,
        result: `Geolocation failed. ${response.result}`,
      };
    }

    return response;
  } catch (error) {
    isGeolocating = false;
    return { success: false, result: error };
  }
}

function log(message, data) {
  if (ENV === "prod") return;
  const time = `${new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}.${new Date().getMilliseconds()}`.padEnd(12, " ");
  const moduleIndicator = `Chrome>`.padEnd(14, " ");

  console.log(
    `%c${time} | ${moduleIndicator}%c ${message}`,
    "color: #808080;",
    `color: "inherit";`,
    data ? data : "",
  );
}

chrome.runtime.onMessage.addListener((message) => {
  function responseHandler(response) {
    log(`Sending response for ${message.action} message ...`);
    chrome.runtime.sendMessage({
      ...response,
      action: `${message.action}_result`,
    });
  }

  function errorHandler(error) {
    responseHandler({ success: false, result: error });
  }

  if (message.action === "register") {
    register(
      message.data.email,
      message.data.password,
      message.data.displayName,
    )
      .then((response) => {
        if (response.success) {
          // TODO: Add to BoardApp newslleter
        }
        responseHandler(response);
      })
      .catch((error) => errorHandler(error));
  } else if (message.action === "login") {
    login(message.data.email, message.data.password)
      .then((response) => responseHandler(response))
      .catch((error) => errorHandler(error));
  } else if (message.action === "logout") {
    handleLogout(message.data.reason);
  } else if (message.action === "send_notification") {
    sendNotification(message.data)
      .then((response) => responseHandler(response))
      .catch((error) => errorHandler(error));
  } else if (message.action === "geolocation") {
    if (isGeolocating) return;
    geolocation()
      .then((response) => responseHandler(response))
      .catch((error) => errorHandler(error));
  }
});
