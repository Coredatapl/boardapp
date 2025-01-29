import { Dispatch, SetStateAction, createContext } from 'react';
import { NotificationData } from '../components/widgets/notifications/NotificationWidget';

export interface NotifyItem {
  added: string;
  message: string;
}

export interface NotificationsStateData {
  notifications: NotificationData[];
}

export const defaultNotificationsState: NotificationsStateData = {
  notifications: [],
};

export const NotificationsStateContext = createContext({
  notificationsState: {} as NotificationsStateData,
  setNotificationsState: {} as Dispatch<SetStateAction<NotificationsStateData>>,
});
