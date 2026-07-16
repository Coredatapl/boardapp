import type { ApiActionType } from "@/types/api";

const apiRequest = async (action: ApiActionType, data: any): Promise<void> => {
	if (!chrome?.runtime) {
		throw new Error("Api integration is only available in Chrome extension");
	}
	return chrome.runtime.sendMessage({ action, data });
};

const apiRegister = async (
	email: string,
	password: string,
	displayName: string,
): Promise<void> => {
	return apiRequest("register", {
		email,
		password,
		displayName,
	});
};

const apiLogin = async (email: string, password: string): Promise<void> => {
	return apiRequest("login", {
		email,
		password,
	});
};

const apiLogout = async (reason: string): Promise<void> => {
	return apiRequest("logout", {
		reason,
	});
};

const apiSendNotification = async (
	notifications: {
		label: string;
		desc: string;
		created: number;
		type: "todo" | "weather";
	}[],
): Promise<void> => {
	return apiRequest("send_notification", {
		notifications,
	});
};

export { apiLogin, apiLogout, apiRegister, apiSendNotification };
