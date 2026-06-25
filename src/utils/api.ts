import * as JWT from "jose";
import type {
  ApiError,
  ApiPayload,
  ApiResponse,
  ApiResult,
  NoBody,
  TypedHeaders,
  TypedRequestInit,
  TypedResponse,
  WithBody,
} from "@/types/api";

declare function fetch<ResponseType = any>(
  input: string | URL | globalThis.Request,
  init?: TypedRequestInit,
): Promise<TypedResponse<ResponseType>>;

const generateToken = async (url: string) => {
  const payload = {
    route: new URL(url).pathname,
    stoken: `${import.meta.env.VITE_APP_API_SECRET}`,
    ttoken: `${Date.now()}`,
  };
  const secret = new TextEncoder().encode(
    `${import.meta.env.VITE_APP_API_SECRET}`,
  );
  const token = await new JWT.SignJWT({
    sub: JSON.stringify(payload),
    iss: "Coredata",
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return token;
};

const apiService = {
  async send(
    method: WithBody | NoBody,
    url: string,
    body?: string,
  ): Promise<ApiResult> {
    const token = await generateToken(url);
    const headers: TypedHeaders = {
      "Content-type": "application/json",
      "X-Coredata-Token": `${token}`,
    };
    const options = {
      method,
      mode: "cors",
      cache: "no-cache",
      headers,
      body,
    } as TypedRequestInit;

    try {
      const response = await fetch<ApiResponse>(url, options);

      if (!response.ok) {
        const error = await getError(response);

        return {
          success: false,
          result: error,
        };
      }

      const result = response.status !== 204 ? await response.json() : null;

      return { success: true, result };
    } catch (exception) {
      console.error("Api error:", exception);
      const error: ApiError = {
        code: 503,
        message: "Service Unavailable",
        description: `Api is currently unavailable. ${exception}`,
        payload: null,
      };
      return { success: false, result: error };
    }
  },
};

const getError = async (response: Response): Promise<ApiError> => {
  const status = response.status;
  const defaultDescription = "An error occurred while sending data";
  const error: ApiError = {
    code: status,
    message: `Api error ${status}`,
    description: defaultDescription,
    payload: null,
  };

  try {
    const payload: ApiPayload = await response.json();

    error.description = payload.status ?? defaultDescription;
    error.payload = payload;

    if (status === 401) {
      error.message = `Authentication error ${status}`;
      error.description = payload.status ?? "Credentials incorrect";
    } else if (status === 403) {
      error.message = `Authorisation error ${status}`;
      error.description = "No permissions for the resource";
    }
    console.error("Api error response:", payload);
    return error;
  } catch (exception) {
    console.error("Api error message parse error:", exception);
    return error;
  }
};

const sendEmail = async (
  name: string,
  email: string,
  message: string,
): Promise<ApiResult> => {
  const url = `${import.meta.env.VITE_APP_API_URL}/email/send`;
  const body = JSON.stringify({
    recipient: `${import.meta.env.VITE_APP_API_RECIPIENT}`,
    subject: `Message from ${name} ${email} via website`,
    message: `Name: ${name}\nEmail: ${email}\nMessage:\n\n ${message}`,
  });

  return apiService.send("POST", url, body);
};

const sendNotification = async (
  displayName: string,
  notifications: {
    label: string;
    desc: string;
    created: number;
    type: "todo" | "weather";
  }[],
): Promise<ApiResult> => {
  const url = `${import.meta.env.VITE_APP_API_URL}/email/send`;
  const body = JSON.stringify({
    recipient: `${import.meta.env.VITE_APP_CONTACT_EMAIL}`,
    subject: `BoardApp Notifications`,
    template: "boardapp-notification",
    templateData: { displayName, notifications },
  });

  return apiService.send("POST", url, body);
};

export type { ApiResult };
export { sendEmail, sendNotification };
