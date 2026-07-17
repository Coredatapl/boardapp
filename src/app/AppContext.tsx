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
import type { Shortcut } from "@/features/shortcuts/types/shortcut";
import type { TodoItem } from "@/features/todo/types/todoItem";
import type { UserAccount } from "@/types/account";
import type { MessageCallback } from "@/types/api";
import type { AppSettings } from "@/types/settings";

export const AppContext = createContext<{
	isMobile: boolean;
	isExtension: boolean;
	editMode: boolean;
	setEditMode: Dispatch<SetStateAction<boolean>>;
	settings: AppSettings;
	setSettings: Dispatch<SetStateAction<AppSettings>>;
	account: UserAccount | undefined;
	setAccount: Dispatch<SetStateAction<UserAccount | undefined>>;
	messageCallbacks: Map<string, MessageCallback[]>;
	registerMessageCallback(action: string, callback: MessageCallback): void;
	notifications: AppNotification[];
	setNotifications: Dispatch<SetStateAction<AppNotification[]>>;
	triggerNotification(data: AppNotificationDto): void;
	unreadNotidications: boolean;
	setUnreadNotidications: Dispatch<SetStateAction<boolean>>;
	todos: TodoItem[];
	setTodos: Dispatch<SetStateAction<TodoItem[]>>;
	undoneTodos: boolean;
	setUndoneTodos: Dispatch<SetStateAction<boolean>>;
	shortcuts: Shortcut[];
	setShortcuts: Dispatch<SetStateAction<Shortcut[]>>;
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
		account: context.account,
		setAccount: context.setAccount,
		messageCallbacks: context.messageCallbacks,
		registerMessageCallback: context.registerMessageCallback,
		notifications: context.notifications,
		setNotifications: context.setNotifications,
		triggerNotification: context.triggerNotification,
		unreadNotidications: context.unreadNotidications,
		setUnreadNotidications: context.setUnreadNotidications,
		todos: context.todos,
		setTodos: context.setTodos,
		undoneTodos: context.undoneTodos,
		setUndoneTodos: context.setUndoneTodos,
		shortcuts: context.shortcuts,
		setShortcuts: context.setShortcuts,
	};
}
