import { useState } from 'react';
import { TodoItemData } from './TodoWidget';
import { DateTime } from '../../../utils/DateTime';
import Checkbox from '../../common/Checkbox';

interface TodoItemProps {
  itemId: number;
  item: TodoItemData;
  updateTotoItem: (i: TodoItemData) => void;
  deleteItem: (i: TodoItemData) => void;
}

function TodoItem({ itemId, item, updateTotoItem, deleteItem }: TodoItemProps) {
  const [done, setDone] = useState(item.done);
  const [isHovered, setIsHovered] = useState(false);
  const elementId = `todo-item-${itemId}`;

  function toggleDone() {
    item.done = !done;
    setDone(!done);
    updateTotoItem(item);
  }

  function getAddedTime(): string | undefined {
    if (item.added) {
      const timeAgo = DateTime.getTimeAgo(item.added);
      return timeAgo;
    }
  }

  return (
    <div
      className="flex items-center pl-2 rounded-md transition-all transform ease-in-out hover:bg-gray-100"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Checkbox
        name={elementId}
        defaultValue={item.done}
        style="peer-checked:line-through"
        onChange={toggleDone}
      >
        {item.name}
        <p className="text-xs font-light italic text-gray-600">
          {getAddedTime()}
        </p>
      </Checkbox>
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

export default TodoItem;
