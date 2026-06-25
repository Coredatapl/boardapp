import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext,
} from "react";
import type {
	AppNotification,
	AppNotificationDto,
} from "@/features/notifications/types/notification";
import type { AppSettings } from "@/types/settings";

export const AppContext = createContext<{
	isMobile: boolean;
	isExtension: boolean;
	editMode: boolean;
	setEditMode: Dispatch<SetStateAction<boolean>>;
	settings: AppSettings;
	setSettings: Dispatch<SetStateAction<AppSettings>>;
	notifications: AppNotification[];
	setNotifications: Dispatch<SetStateAction<AppNotification[]>>;
	triggerNotification(data: AppNotificationDto): void;
	unreadNotidications: boolean;
	setUnreadNotidications: Dispatch<SetStateAction<boolean>>;
	undoneTodos: boolean;
	setUndoneTodos: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function useAppContext() {
	const context = useContext(AppContext);
	if (context === null) {
		throw new Error("App context is available only within AppContext.Provider");
	}

	return {
		isMobile: context.isMobile,
		isExtension: context.isExtension,
		editMode: context.editMode,
		setEditMode: context.setEditMode,
		settings: context.settings,
		setSettings: context.setSettings,
		notifications: context.notifications,
		setNotifications: context.setNotifications,
		triggerNotification: context.triggerNotification,
		unreadNotidications: context.unreadNotidications,
		setUnreadNotidications: context.setUnreadNotidications,
		undoneTodos: context.undoneTodos,
		setUndoneTodos: context.setUndoneTodos,
	};
}
