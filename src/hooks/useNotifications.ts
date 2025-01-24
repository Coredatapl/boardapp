import { useContext } from 'react';
import { NotificationService } from '../components/widgets/notifications/NotificationService';
import { NotificationData } from '../components/widgets/notifications/NotificationWidget';
import {
  NotificationsStateContext,
  NotifyItem,
} from '../utils/NotificationsContext';
import { CacheApi } from '../utils/cache/CacheApi';

export const useNotifications = () => {
  const context = useContext(NotificationsStateContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsStateContext'
    );
  }
  const notificationService = new NotificationService(new CacheApi());

  const generateNotifications = (
    items: NotifyItem[],
    limit: number,
    triggerPrefix: string = 'item'
  ) => {
    const notifications = notificationService.load();

    for (const item of items) {
      const trigger = `${triggerPrefix}-${new Date(item.added).getTime()}`;
      const elapsed = Date.now() - new Date(item.added).getTime();

      if (
        elapsed <= limit ||
        notifications?.findIndex(
          (n) => n.trigger === trigger && n.status !== 'failed'
        ) !== -1
      ) {
        continue;
      }

      const notification: NotificationData = {
        id: notifications?.length || 1,
        type: 'email',
        message: item.message,
        status: 'pending',
        added: new Date().toISOString(),
        trigger,
      };
      const existing = context.notificationsState.notifications.find(
        (n) => n.trigger === trigger && n.status !== 'failed'
      );
      const existingOutdated =
        typeof existing === 'undefined' ||
        Date.now() - new Date(existing.added).getTime() >= limit;

      if (!existingOutdated) {
        continue;
      }

      context.setNotificationsState((state) => ({
        notifications: [...state.notifications, notification],
      }));
      notificationService.add(notification);
    }
  };

  return { ...context, generateNotifications };
};
