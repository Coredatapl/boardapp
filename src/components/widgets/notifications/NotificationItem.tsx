import { useEffect, useState } from 'react';
import { NotificationData } from './NotificationWidget';
import { DateTime } from '../../../utils/DateTime';
import Checkbox from '../../common/Checkbox';

interface NotificationItemProps {
  itemId: string;
  item: NotificationData;
  deleteItem: (i: NotificationData) => void;
}

function NotificationItem({ itemId, item, deleteItem }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  function getAddedTime(): string | undefined {
    if (item.added) {
      const timeAgo = DateTime.getTimeAgo(item.added);
      return timeAgo;
    }
  }

  function renderStatus(status: string) {
    switch (status) {
      case 'pending':
        return <span className="text-blue-600">Pending</span>;
      case 'sent':
        return <span className="text-green-600">Sent</span>;
      case 'failed':
        return <span className="text-red-600">Failed</span>;
      default:
        return <span className="text-gray-600">Unknown</span>;
    }
  }

  useEffect(() => {
    getAddedTime();
  }, [item]);

  return (
    <div
      className="flex items-center py-2 pl-2 rounded-md transition-all transform ease-in-out hover:bg-gray-100"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <div className="">
        <div className="flex w-11/12">{item.message}</div>
        <div className="">
          {renderStatus(item.status)}
          <span className="ml-2 text-xs lowercase font-light italic text-gray-600">
            {item.trigger}
          </span>
          <span className="ml-1 text-xs lowercase font-light italic text-gray-600">
            {getAddedTime()}
          </span>
        </div>
      </div>
      <div
        className={`absolute right-2 p-1.5 mr-2 mb-1 grid place-items-center items-center align-middle cursor-pointer text-gray-700 transition-all transform ease-in-out hover:rounded-md hover:bg-gray-200 hover:text-gray-900 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => deleteItem(item)}
        title="Delete item"
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
    </div>
  );
}

export default NotificationItem;
