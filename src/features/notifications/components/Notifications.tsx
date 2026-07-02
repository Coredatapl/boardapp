import { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import Button from "@/components/ui/Button";
import { usePanel } from "@/components/ui/panel/hooks/usePanel";
import Panel from "@/components/ui/panel/Panel";
import PanelBody from "@/components/ui/panel/PanelBody";
import PanelHeader from "@/components/ui/panel/PanelHeader";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { sendNotification } from "@/utils/api";
import { compare } from "@/utils/common";
import { OneYearMs } from "@/utils/time";
import type { AppNotification } from "../types/notification";
import NotificationItem from "./NotificationItem";
import type { ApiResponse } from "@/types/api";
import { useLogger } from "@/hooks/useLogger";

export default function Notifications() {
  const {
    isExtension,
    settings,
    notifications,
    setNotifications,
    setUnreadNotidications,
  } = useAppContext();
  const { t } = useTranslate();
  const storage = useStorage();
  const logger = useLogger("Notifications");
  const { activePanel, closePanel } = usePanel();
  const notifyCreatedLimit = 1000 * 60 * 60 * 24;
  const lastSendPeriod = 1000 * 60 * 60 * 24;

  function readItem(id: string) {
    if (
      notifications.findIndex((n) => compare(n.id, id) && n.read === false) ===
      -1
    ) {
      return;
    }

    const updated = [
      ...notifications.map((n) => {
        if (compare(n.id, id)) {
          n.read = true;
        }
        return n;
      }),
    ];
    saveNotifications(updated);
  }

  function markAllAsEmailed() {
    const updated = [
      ...notifications.map((n) => {
        n.emailed = true;
        return n;
      }),
    ];
    saveNotifications(updated);
  }

  function deleteItem(id: string) {
    const updated = [...notifications.filter((n) => n.id !== id)];
    saveNotifications(updated);
  }

  function deleteRead() {
    if (!notifications.some((n) => n.read)) return;
    const updated = notifications.filter((n) => n.read === false);
    saveNotifications(updated);
  }

  function saveNotifications(notifications: AppNotification[]) {
    setNotifications(notifications);
    storage.set("notifications", notifications, OneYearMs);
  }

  async function sendNotifications(notifications: AppNotification[]) {
    if (!isExtension) return;

    const recipient = settings.contactEmail;
    const displayName = settings.displayName;
    const data = notifications
      .filter((n) => !n.emailed && n.created < Date.now() + notifyCreatedLimit)
      .map((n) => ({
        label: n.label,
        desc: n.description,
        created: Math.round(n.created / 1000),
        type: n.triggerType,
      }));

    if (!data.length) return;

    sendNotification(recipient, displayName, data);
    logger.log("Sending notifications", "...");
  }

  function onSendNotification(response: ApiResponse) {
    if (!response.success) {
      logger.log("Sending notifications failed");
      return;
    }

    markAllAsEmailed();
    storage.set("notifications-send", Date.now(), OneYearMs);
    logger.log("Sending notifications", "done");
  }

  useEffect(() => {
    setUnreadNotidications(notifications.some((n) => n.read === false));
  }, [notifications]);

  useEffect(() => {
    if (notifications.some((n) => !n.emailed)) {
      const lastSend = storage.get<number>("notifications-send");
      if (!lastSend || lastSend >= Date.now() + lastSendPeriod) {
        sendNotifications(notifications);
      }
    }

    if (isExtension) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "send_notification") {
          onSendNotification(message);
        }
        return false;
      });
    }
  }, []);

  return (
    <Panel isActive={activePanel === "notifications"}>
      <PanelHeader title={t("notifications.header")} onClose={closePanel} />
      <PanelBody>
        {!notifications.length && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <p className="text-sm dark:text-white/70 text-gray-600 flex-1">
              {t("notifications.noItems")}
            </p>
          </div>
        )}
        {notifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            readItem={readItem}
            deleteItem={deleteItem}
          />
        ))}
      </PanelBody>
      {notifications.length > 0 && (
        <div className="flex justify-center items-center px-auto py-2.5">
          <Button label={t("notifications.removeRead")} onClick={deleteRead} />
        </div>
      )}
    </Panel>
  );
}
