export type ApiActionType =
	| "register"
	| "login"
	| "logout"
	| "send_notification"
	| "geolocation";

export type MessageCallback = (message: any) => void;

export interface ApiResponse {
	success: boolean;
	result: any;
	action: string;
}

export interface ApiSessionExpiredResponse {
	reason: string;
}
