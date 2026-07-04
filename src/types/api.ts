export type ApiActionType = "authenticate" | "logout" | "send_notification";

export type MessageCallback = (message: any) => void;

export interface ApiResponse {
  success: boolean;
  result: any;
  action: string;
}

export interface ApiSessionExpiredResponse {
  reason: string;
}
