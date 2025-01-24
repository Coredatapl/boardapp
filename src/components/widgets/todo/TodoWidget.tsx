import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TodoItem from './TodoItem';
import { TodoService } from './TodoService';
import IconButton from '../../common/IconButton';
import { useUtil } from '../../../hooks/useUtil';
import { useModal } from '../../../hooks/useModal';
import { useGlobalState } from '../../../hooks/useGlobalState';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { ModalTypeEnum } from '../../../utils/ModalContext';
import { NotificationService } from '../notifications/NotificationService';

import imgSaveIcon from '../../../assets/img/icons/icon-save.svg';
import { useNotifications } from '../../../hooks/useNotifications';

interface TodoWidgetProps {
  setTopbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TodoItemData {
  name: string;
  done: boolean;
  added: string;
}

export default function TodoWidget({ setTopbarOpen }: TodoWidgetProps) {
  const { globalState } = useGlobalState();
  const { generateNotifications } = useNotifications();
  const [showWidget, setShowWidget] = useState(false);
  const [todoList, setTodoList] = useState<TodoItemData[]>([]);
  const [undoneCount, setUndoneCount] = useState(0);
  const { targetInside } = useUtil();
  const { setModalState } = useModal();
  const todoWidgetRef = useRef<HTMLDivElement>(null);
  const todoWidgetLinkRef = useRef<HTMLAnchorElement>(null);
  const [inputInvalid, setInputInvalid] = useState(false);
  const isActive = globalState.widgetTodoActive;
  const Todos = new TodoService(new CacheApi());
  const Notifications = new NotificationService(new CacheApi());

  function toggleShowWidget() {
    setShowWidget(!showWidget);
    setTopbarOpen(!showWidget);
  }

  function getListFromCache(): TodoItemData[] {
    const cached = Todos.load();
    const list = cached ? cached : todoList;
    return list;
  }

  function validateInput(input: HTMLInputElement): boolean {
    const nameLength = input.value.length;

    setInputInvalid(false);
    if (
      !nameLength ||
      nameLength < Todos.nameMinLength ||
      nameLength > Todos.nameMaxLength
    ) {
      setInputInvalid(true);
      return false;
    }
    return true;
  }

  function addItem() {
    const input = document.getElementById(
      'newTodoNameInput'
    ) as HTMLInputElement;
    const valid = validateInput(input);

    if (!valid) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.prompt,
        prompt: `The Todo item name should be a min of ${Todos.nameMinLength} and a max of ${Todos.nameMaxLength} characters.`,
        showModal: true,
      }));
      return;
    }

    const list = getListFromCache();
    const itemExists = list.findIndex((v) => v.name === input.value) !== -1;

    if (itemExists) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.prompt,
        prompt: `The Todo item name already exists.`,
        showModal: true,
      }));
      return;
    }

    list.push({
      name: input.value,
      done: false,
      added: new Date().toISOString(),
    });
    updateList(list);
    input.value = '';
  }

  function updateItem(item: TodoItemData) {
    const list = getListFromCache();
    const updated = list.map((i) => {
      if (i.name === item.name) {
        return { ...item };
      } else {
        return i;
      }
    });
    updateList(updated);
  }

  function updateList(list: TodoItemData[]) {
    setTodoList([...list]);
    setUndoneCount(list.filter((i) => !i.done).length);
    Todos.update([...list]);
  }

  function deleteDoneItems() {
    const list = getListFromCache();
    const filtered = list.filter((i) => !i.done);
    updateList(filtered);
  }

  function deleteItem(item: TodoItemData) {
    const list = getListFromCache();
    const filtered = list.filter(
      (i) => i.name !== item.name || i.added !== item.added
    );
    updateList(filtered);
  }

  function handleClickOutside(event: MouseEvent) {
    const inputFocused =
      document.activeElement ===
      (document.getElementById('newTodoNameInput') as HTMLInputElement);
    if (
      inputFocused ||
      !todoWidgetLinkRef.current ||
      !todoWidgetRef.current ||
      !event.target ||
      targetInside(event.target, todoWidgetLinkRef.current)
    ) {
      return;
    }

    if (!targetInside(event.target, todoWidgetRef.current)) {
      setShowWidget(false);
    }
  }

  function handleInputChange(input: HTMLInputElement) {
    validateInput(input);
  }

  function createNotifications() {
    if (!globalState.notificationsActive) {
      return;
    }
    const items = getListFromCache()
      .filter((i) => !i.done)
      .map((item) => {
        return {
          added: item.added,
          message: `Todo item "${item.name}" is still pending. Maybe it's time to complete it?`,
        };
      });
    const limit =
      1000 * 60 * 60 * 24 * (globalState.todoNotifyAfterDays as number);

    generateNotifications(items, limit, 'todo');
  }

  useEffect(() => {
    const list = getListFromCache();
    setUndoneCount(list.filter((i) => !i.done).length);
    setTodoList(list);
    createNotifications();

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
        ref={todoWidgetLinkRef}
        to="/"
        className="text-white/80 hover:text-white text-base leading-relaxed inline-block py-2 whitespace-nowrap text-shadow-xs shadow-gray-700"
        onClick={toggleShowWidget}
        title={'Todo list'}
      >
        Todo
        {undoneCount > 0 && (
          <sup className="absolute top-3 w-4 h-4 inline-flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
            {undoneCount}
          </sup>
        )}
      </Link>

      <div className="relative left-0" ref={todoWidgetRef}>
        <div
          className={`${
            !showWidget ? 'hidden' : 'z-30 opacity-100 animate-slidedown'
          } absolute top-4 right-0 w-80 bg-white/70 rounded-lg shadow-lg backdrop-blur-sm transition-opacity duration-100 ease-in divide-y divide-gray-100`}
        >
          <div className="px-4 pt-3">
            <h3 className="pb-3 text-xl font-medium text-gray-900">
              Todo list
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
            <div className="relative">
              <input
                id="newTodoNameInput"
                type="text"
                className={`block w-full p-2 pl-2 text-sm text-gray-900 rounded-md outline-none bg-gray-50  border border-slate-300 ${
                  inputInvalid ? 'app-input-invalid' : ''
                }`}
                placeholder="New item name"
                minLength={Todos.nameMinLength}
                maxLength={Todos.nameMaxLength}
                required
                onChange={(e) => handleInputChange(e.target)}
              />
              <IconButton
                iconSrc={imgSaveIcon}
                onClick={addItem}
                title="Save"
                alt="Save"
              />
            </div>
            {todoList.length ? (
              <ul className="pt-3 overflow-y-auto text-sm text-gray-900">
                {todoList.map((item, idx) => {
                  const itemId = `todo-item-${item.name}-${idx}`;
                  return (
                    <li key={`todo-item-${idx}`}>
                      <TodoItem
                        itemId={itemId}
                        item={{ ...item }}
                        updateTotoItem={updateItem}
                        deleteItem={deleteItem}
                        key={itemId}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-center text-gray-900">
                No todo items
              </div>
            )}
          </div>

          <button
            className={`${
              !todoList.length ? 'hidden' : ''
            } flex items-center justify-center w-full p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-white/70 hover:underline`}
            onClick={deleteDoneItems}
          >
            Remove&nbsp; <b>done</b> &nbsp;items
          </button>
        </div>
      </div>
    </>
  );
}
