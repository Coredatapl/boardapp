import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../hooks/useGlobalState';
import { useUtil } from '../../../hooks/useUtil';
import NotificationItem from './NotificationItem';
import { NotificationService } from './NotificationService';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { useNotifications } from '../../../hooks/useNotifications';

export interface NotificationData {
  id: number;
  type: 'email';
  message: string;
  status: 'pending' | 'sent' | 'failed';
  added: string;
  trigger: string;
}

export default function NotificationWidget() {
  const { globalState } = useGlobalState();
  const { notificationsState, setNotificationsState } = useNotifications();
  const { targetInside } = useUtil();
  const [showWidget, setShowWidget] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetLinkRef = useRef<HTMLAnchorElement>(null);
  const isActive = globalState.widgetNotificationsActive;
  const Notifications = NotificationService.getInstance();

  function toggleShowWidget() {
    setShowWidget(!showWidget);
  }

  function getListFromCache(): NotificationData[] {
    const cached = Notifications.load();
    const list = cached ? cached : notificationsState.notifications;
    return list ?? [];
  }

  function updateList(list: NotificationData[]) {
    setNotificationsState({ notifications: [...list] });
    setActiveCount(list.filter((i) => i.status === 'pending').length);
    Notifications.update([...list]);
  }

  function deleteItem(item: NotificationData) {
    const list = getListFromCache();
    const filtered = list.filter(
      (i) => i.id !== item.id || i.added !== item.added
    );
    updateList(filtered);
  }

  function deleteSentItems() {
    const list = getListFromCache();
    const filtered = list.filter((i) => i.status !== 'sent');
    updateList(filtered);
  }

  function checkNotifications(list: NotificationData[]) {
    const toSend: { idx: number; value: NotificationData }[] = [];
    for (let i = 0; i < list.length; i++) {
      const toNotify =
        Date.now() - new Date(list[i].added).getTime() >=
        Notifications.notifyAfterDays * 24 * 60 * 60 * 1000;
      if (
        list[i].status === 'pending' &&
        toNotify &&
        Object.values(toSend)
          .map((v) => v.idx)
          .includes(i) === false
      ) {
        toSend.push({ idx: i, value: list[i] });
      }
    }
    return toSend;
  }

  async function sendNotifications() {
    const list = getListFromCache();
    const toSend = checkNotifications(list);
    if (toSend.length > 0) {
      const items = toSend.map((item) => item.value);
      const result = await Notifications.requestSend(items);
      for (const i of Object.values(toSend).map((v) => v.idx)) {
        if (result) {
          list[i].status = 'sent';
        } else {
          list[i].status = 'failed';
        }
      }
      updateList(list);
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const inputFocused =
      document.activeElement ===
      (document.getElementById('newTodoNameInput') as HTMLInputElement);
    if (
      inputFocused ||
      !widgetLinkRef.current ||
      !widgetRef.current ||
      !event.target ||
      targetInside(event.target, widgetLinkRef.current)
    ) {
      return;
    }

    if (!targetInside(event.target, widgetRef.current)) {
      setShowWidget(false);
    }
  }

  useEffect(() => {
    const list = getListFromCache();
    setActiveCount(list.filter((i) => i.status === 'pending').length);
    setNotificationsState({ notifications: [...list] });
    sendNotifications();

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  if (!isActive) {
    return <></>;
  }

  return (
    <>
      <Link
        ref={widgetLinkRef}
        to="/"
        className="text-white/80 hover:text-white text-base leading-relaxed inline-block py-2 whitespace-nowrap text-shadow-xs shadow-gray-700"
        onClick={toggleShowWidget}
        title={'Notifications'}
      >
        Notifications
        {activeCount > 0 && (
          <sup className="absolute top-3 w-4 h-4 inline-flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
            {activeCount}
          </sup>
        )}
      </Link>

      <div className="relative left-0" ref={widgetRef}>
        <div
          className={`${
            !showWidget ? 'hidden' : 'z-30 opacity-100 animate-slidedown'
          } absolute top-4 right-0 w-96 bg-white/70 rounded-lg shadow-lg backdrop-blur-sm transition-opacity duration-100 ease-in divide-y divide-gray-100`}
        >
          <div className="px-4 pt-3">
            <h3 className="pb-3 text-xl font-medium text-gray-900">
              Notifications list
            </h3>
            <button
              type="button"
              className="absolute top-3 right-4 p-1 ml-auto rounded-md inline-flex items-center text-sm text-gray-500 bg-transparent hover:text-gray-900"
              onClick={() => toggleShowWidget()}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 transition-all transform ease-in-out hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="px-4 py-3">
            {notificationsState.notifications?.length ? (
              <ul className="overflow-y-auto text-sm text-gray-900">
                {notificationsState.notifications.map((item, idx) => {
                  const itemId = `notification-item-${idx}`;
                  return (
                    <li key={itemId}>
                      <NotificationItem
                        itemId={itemId}
                        item={{ ...item }}
                        deleteItem={deleteItem}
                        key={itemId}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-center text-gray-900">
                No notification items
              </div>
            )}
          </div>

          <button
            className={`${
              !notificationsState.notifications?.length ? 'hidden' : ''
            } flex items-center justify-center w-full p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-white/70 hover:underline`}
            onClick={deleteSentItems}
          >
            Remove&nbsp; <b>sent</b> &nbsp;items
          </button>
        </div>
      </div>
    </>
  );
}
