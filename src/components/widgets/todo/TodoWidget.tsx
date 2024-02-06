import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TodoItem from './TodoItem';
import IconButton from '../../common/IconButton';
import { TodoService } from './TodoService';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { useGlobalState } from '../../../utils/useGlobalState';
import { useUtil } from '../../../utils/useUtil';
import { useModal } from '../../../utils/useModal';
import { ModalTypeEnum } from '../../../utils/ModalContext';

import imgSaveIcon from '../../../assets/img/icons/icon-save.svg';

export interface TodoItemData {
  name: string;
  done: boolean;
  added: string;
}

export default function TodoWidget() {
  const { globalState } = useGlobalState();
  const [showWidget, setShowWidget] = useState(false);
  const [todoList, setTodoList] = useState<TodoItemData[]>([]);
  const [undoneCount, setUndoneCount] = useState(0);
  const { targetInside } = useUtil();
  const { setModalState } = useModal();
  const todoWidgetRef = useRef<HTMLDivElement>(null);
  const todoWidgetLinkRef = useRef<HTMLAnchorElement>(null);
  const isActive = globalState.widgetTodoActive;
  const Todos = new TodoService(new CacheApi());

  function toggleShowWidget() {
    setShowWidget(!showWidget);
  }

  function getListFromCache(): TodoItemData[] {
    const cached = Todos.load();
    const list = cached ? cached : todoList;
    return list;
  }

  function addTotoItem() {
    const input = document.getElementById(
      'newTodoNameInput'
    ) as HTMLInputElement;

    const nameLength = input.value.length;
    if (
      !nameLength ||
      nameLength < Todos.nameMinLength ||
      nameLength > Todos.nameMaxLength
    ) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.prompt,
        prompt: `The Todo item name should be a min of ${Todos.nameMinLength} and a max of ${Todos.nameMaxLength} characters.`,
        showModal: true,
      }));
      return;
    }

    const list = getListFromCache();
    list.push({
      name: input.value,
      done: false,
      added: new Date().toISOString(),
    });
    updateList(list);
    input.value = '';
  }

  function updateTotoItem(item: TodoItemData) {
    const list = getListFromCache();
    const idx = list.findIndex((i) => i.name === item.name);

    list[idx] = item;
    updateList(list);
  }

  function updateList(list: TodoItemData[]) {
    setTodoList(list);
    setUndoneCount(list.filter((i) => !i.done).length);
    Todos.update(list);
  }

  function deleteDoneItems() {
    const filtered = todoList.filter((i) => !i.done);
    updateList([...filtered]);
  }

  function deleteItem(item: TodoItemData) {
    const filtered = todoList.filter(
      (i) => i.name !== item.name || i.added !== item.added
    );
    updateList([...filtered]);
  }

  function handleClick(event: MouseEvent) {
    if (
      !event.target ||
      targetInside(event.target, todoWidgetLinkRef.current as HTMLElement)
    ) {
      return;
    }

    if (!targetInside(event.target, todoWidgetRef.current as HTMLElement)) {
      setShowWidget(false);
    }
  }

  useEffect(() => {
    const list = getListFromCache();
    setUndoneCount(list.filter((i) => !i.done).length);
    setTodoList(list);

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
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
          className={`z-10 ${
            !showWidget ? 'hidden' : ''
          } absolute top-4 right-0 z-10 bg-white/70 rounded-lg shadow-lg w-60 backdrop-blur-sm divide-y divide-gray-100`}
        >
          <div className="px-4 pt-3">
            <h3 className="pb-3 text-xl font-medium text-gray-900">
              Todo list
            </h3>
          </div>
          <div className="px-4 py-3">
            <div className="relative">
              <input
                id="newTodoNameInput"
                type="text"
                className="block w-full p-2 pl-2 text-sm text-gray-900 rounded-md outline-none bg-gray-50  border border-slate-300 invalid:border-red-600 invalid:text-red-600"
                placeholder="New item name"
                minLength={Todos.nameMinLength}
                maxLength={Todos.nameMaxLength}
                required
              />
              <IconButton
                iconSrc={imgSaveIcon}
                onClick={addTotoItem}
                title="Save"
                alt="Save"
              />
            </div>
          </div>
          {todoList.length ? (
            <ul className="px-3 py-3 overflow-y-auto text-sm text-gray-900">
              {todoList.map((item, idx) => {
                return (
                  <li key={`todo-item-${idx}`}>
                    <TodoItem
                      itemId={idx}
                      item={item}
                      updateTotoItem={updateTotoItem}
                      deleteItem={deleteItem}
                      key={`todo-item-${idx}`}
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
