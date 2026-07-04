import { type PropsWithChildren, Suspense, useEffect, useState } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import AppView from "@/components/AppView";
import ErrorFallback from "@/components/ErrorFallback";
import LoadingFallback from "@/components/LoadingFallback";
import { ModalProvider } from "@/components/ui/modal/ModalContext";
import { PanelProvider } from "@/components/ui/panel/PanelContext";
import type {
  AppNotification,
  AppNotificationDto,
} from "@/features/notifications/types/notification";
import type { Shortcut } from "@/features/shortcuts/types/shortcut";
import { defaultShortcuts } from "@/features/shortcuts/utils/data";
import type { TodoItem } from "@/features/todo/types/todoItem";
import { WeatherNotificationTrigger } from "@/features/weather/utils/trigger";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import type { UserAccount } from "@/types/account";
import type { AppSettings } from "@/types/settings";
import { compare, DarkTheme, LightTheme } from "@/utils/common";
import { translator } from "@/utils/i18n/translator";
import { getClientLanguage } from "@/utils/i18n/utils/language";
import { detectMobileDevice } from "@/utils/responsive";
import { OneYearMs } from "@/utils/time";
import { AppContext } from "./AppContext";
import type { MessageCallback } from "@/types/api";

export function AppProvider({ children }: PropsWithChildren) {
  const logger = useLogger();
  const storage = useStorage();
  const isExtension =
    window.chrome &&
    typeof chrome.storage !== "undefined" &&
    typeof chrome.runtime !== "undefined";
  const [isMobile, setIsMobile] = useState(() => detectMobileDevice());
  const [editMode, setEditMode] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(
    storage.get<AppSettings>("settings") ?? {
      lang: getClientLanguage(),
      theme: LightTheme,
      contactEmail: `${import.meta.env.VITE_APP_CONTACT_EMAIL}`,
      displayName: "Boss",
    },
  );
  const [account, setAccount] = useState<UserAccount | undefined>(undefined);
  const [messageCallbacks, setMessageCallbacks] = useState<
    Map<string, MessageCallback[]>
  >(new Map());
  const [notifications, setNotifications] = useState<AppNotification[]>(
    storage.get<AppNotification[]>("notifications") ?? [],
  );
  const [unreadNotidications, setUnreadNotidications] = useState<boolean>(
    notifications.some((n) => n.read === false),
  );
  const [undoneTodos, setUndoneTodos] = useState<boolean>(false);
  let storeInChromeStorageInterval: number | undefined;

  function registerMessageCallback(action: string, callback: MessageCallback) {
    const callbacks = messageCallbacks.get(action) ?? [];
    messageCallbacks.set(action, [...callbacks, callback]);
    setMessageCallbacks(messageCallbacks);
  }

  function triggerNotification(data: AppNotificationDto) {
    if (
      compare(data.trigger, WeatherNotificationTrigger) &&
      notifications?.some(
        (n) =>
          compare(n.trigger, WeatherNotificationTrigger) &&
          n.created < Date.now() + 86400,
      )
    ) {
      // prevent multiple weather alerts
      return;
    }

    const notification: AppNotification = {
      id: `notification_${Date.now()}`,
      label: data.label,
      description: data.description,
      trigger: data.trigger,
      triggerType: data.triggerType,
      remindAfterDays: data.remindAfterDays ?? null,
      read: false,
      emailed: false,
      created: Date.now(),
    };

    setTimeout(() => {
      const updated = [...notifications, notification];
      setNotifications(updated);
      storage.set("notifications", updated, OneYearMs);
      logger.log(
        `Triggered "${notification.label}" notification`,
        "successfully",
      );
    }, 1000);
  }

  function storeInChromeStorage() {
    chrome.storage.local.set({
      settings: settings,
      notifications: notifications,
      shortcuts: storage.get<Shortcut[]>("shortcuts") ?? defaultShortcuts,
      todos: storage.get<TodoItem[]>("todo") ?? [],
    });
  }

  function loadFromChromeStorage() {
    chrome.storage.local.get(
      [
        "account",
        "settings",
        "shortcuts",
        "todo",
        "notifications",
        "weather",
        "location",
      ],
      (items) => {
        if (items.account) {
          setAccount(items.account);
          storage.set("account", items.account);
        }
        if (items.settings) {
          setSettings(items.settings);
          storage.set("settings", items.settings);
        }
        if (items.notifications) {
          setNotifications(items.notifications);
          storage.set("notifications", items.notifications);
        }
        if (items.shortcuts) {
          storage.set("shortcuts", items.shortcuts);
        }
        if (items.todos) {
          storage.set("todo", items.todos);
        }
        storeInChromeStorage();
        logger.log(`Chrome storage data`, "loaded");
      },
    );
  }

  function resizeHandler() {
    setIsMobile(() => detectMobileDevice());
  }

  function keyDownHandler(e: KeyboardEvent) {
    if (compare(e.key, "Escape")) {
      if (editMode) {
        setEditMode(false);
      }
    }
  }

  useEffect(() => {
    const isDark = settings.theme === DarkTheme;
    document.body.classList.toggle(DarkTheme, isDark);
  }, [settings.theme]);

  useEffect(() => {
    if (settings.lang) {
      translator.setLanguage(settings.lang);
    }
  }, [settings.lang]);

  useEffect(() => {
    if (isExtension) {
      logger.log(`Chrome extension mode`, "on");
      loadFromChromeStorage();
      storeInChromeStorageInterval = setInterval(storeInChromeStorage, 10000);
    }

    getClientLanguage();

    window.addEventListener("resize", () => resizeHandler);
    document.addEventListener("keydown", (e: KeyboardEvent) =>
      keyDownHandler(e),
    );

    return () => {
      window.removeEventListener("resize", () => resizeHandler);
      document.removeEventListener("keydown", (e: KeyboardEvent) =>
        keyDownHandler(e),
      );
      if (storeInChromeStorageInterval) {
        clearInterval(storeInChromeStorageInterval);
      }
    };
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            reset={resetErrorBoundary}
            isExtension={isExtension}
            contactEmail={settings.contactEmail}
          />
        )}
        onError={(error, info) => {
          const errorMessage = getErrorMessage(error);
          logger.log(
            `Error inside App provider${errorMessage ? `. Cause: ${errorMessage}` : ""}`,
            {
              stack: info.componentStack,
            },
          );
        }}
      >
        <AppContext.Provider
          value={{
            isMobile,
            isExtension,
            editMode,
            setEditMode,
            settings,
            setSettings,
            account,
            setAccount,
            messageCallbacks,
            registerMessageCallback,
            notifications,
            setNotifications,
            triggerNotification,
            unreadNotidications,
            setUnreadNotidications,
            undoneTodos,
            setUndoneTodos,
          }}
        >
          <ModalProvider>
            <PanelProvider>
              <AppView>{children}</AppView>
            </PanelProvider>
          </ModalProvider>
        </AppContext.Provider>
      </ErrorBoundary>
    </Suspense>
  );
}
