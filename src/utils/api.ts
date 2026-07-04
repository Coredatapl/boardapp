import type { ApiActionType } from "@/types/api";

const apiRequest = async (action: ApiActionType, data: any): Promise<void> => {
  if (!chrome?.runtime) {
    throw new Error("Api integration is only available in Chrome extension");
  }
  return chrome.runtime.sendMessage({ action, data });
};

const authenticate = async (email: string, password: string): Promise<void> => {
  return apiRequest("authenticate", {
    email,
    password,
  });
};

const logout = async (reason: string): Promise<void> => {
  return apiRequest("logout", {
    reason,
  });
};

const sendNotification = async (
  recipient: string,
  displayName: string,
  notifications: {
    label: string;
    desc: string;
    created: number;
    type: "todo" | "weather";
  }[],
): Promise<void> => {
  return apiRequest("send_notification", {
    recipient,
    displayName,
    notifications,
  });
};

export { authenticate, logout, sendNotification };
