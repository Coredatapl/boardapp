console.log("[i] Extension background service worker is running");

const ENV = "dev";
const API_URL = "https://server.coredata.pl";
const API_USER_ROLE = "user";
let isRefreshing = false;
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

async function fetchAuthenticated(url, options = {}) {
  const storage = await chrome.storage.local.get([
    "accessToken",
    "refreshToken",
  ]);

  if (!storage.accessToken) {
    console.error("Authenticated fetch attempt with no auth token");
    return { status: 401, message: "No auth token" };
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${storage.accessToken}`,
  };

  const response = await fetch(url, options);

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
      return fetch(url, options);
    } catch (error) {
      isRefreshing = false;
      refreshSubscribers = [];
      console.error("Authenticated fetch failed", error);
      await handleLogout("auth_failed");
      throw new Error("Session expired");
    }
  }

  return response;
}

// TODO: request timeout (max 5s)
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
    console.error("Send request failed", error);
    throw new Error(`Send request failed. ${error.message}`);
  }
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new Error("No refresh token");

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Refreshing auth tokens failed");
  }

  return response.json(); // { accessToken, refreshToken }
}

async function register(email, password, username) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username, role: API_USER_ROLE }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return { success: true, result: "Registration successful" };
}

async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  const result = await response.json();

  if (!result.accessToken?.length || !result.refreshToken?.length) {
    throw new Error("No auth tokens");
  }

  // TODO: get user account data (userId, username, createdAt)
  await chrome.storage.local.set({
    account: { email, username: email, createdAt: "" },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  return { success: true, result: "Authentication successful" };
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
    templateData: data,
  });
  return sendRequest(route, method, body);
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

  try {
    if (message.action === "register") {
      register(
        message.data.email,
        message.data.password,
        message.data.displayName,
      ).then((response) => {
        if (response.success) {
          login(message.data.email, message.data.password).then(
            (loginResponse) => {
              if (loginResponse.success) {
                // TODO: Add to BoardApp newslleter
              }
              return responseHandler(response);
            },
          );
        }
        return responseHandler(response);
      });
    } else if (message.action === "login") {
      login(message.data.email, message.data.password).then((response) =>
        responseHandler(response),
      );
    } else if (message.action === "logout") {
      handleLogout(message.data.reason);
    } else if (message.action === "send_notification") {
      sendNotification(message.data).then((response) =>
        responseHandler(response),
      );
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }

  return true; // Keeps the communication line open for the async fetch
});
