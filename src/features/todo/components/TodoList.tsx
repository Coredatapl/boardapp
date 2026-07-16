import { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import Button from "@/components/ui/Button";
import { usePanel } from "@/components/ui/panel/hooks/usePanel";
import Panel from "@/components/ui/panel/Panel";
import PanelBody from "@/components/ui/panel/PanelBody";
import PanelHeader from "@/components/ui/panel/PanelHeader";
import type { AppNotificationDto } from "@/features/notifications/types/notification";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { compare } from "@/utils/common";
import { OneYearMs } from "@/utils/time";
import type { TodoItem } from "../types/todoItem";
import AddTodoItem from "./AddTodoItem";
import TodoListItem from "./TodoListItem";

export default function TodoList() {
  const { isExtension, todos, setTodos, setUndoneTodos, triggerNotification } =
    useAppContext();
  const { t } = useTranslate();
  const logger = useLogger("TodoList");
  const storage = useStorage();
  const { activePanel, closePanel } = usePanel();

  function addItem(item: TodoItem) {
    const existingItem = todos.find((t) => compare(t.label, item.label));
    if (existingItem) {
      const updatedExisting = todos.map((t) => {
        if (compare(t.id, existingItem.id)) {
          t.done = false;
          t.created = item.created;
        }
        return t;
      });
      saveTodos(updatedExisting);
      logger.log(`Existing "${existingItem.label}" todo item`, "refreshed");
      return;
    }

    const updated = [...todos, item];
    const data: AppNotificationDto = {
      label: t("todo.notificationLabel"),
      description: item.label,
      trigger: item.id,
      triggerType: "todo",
      remindAfterDays: 7,
    };
    saveTodos(updated);
    triggerNotification(data);
    logger.log(`New todo item`, "created");
  }

  // TODO: on done => delete triggered notification
  function toggleDone(id: string, forceDone?: boolean) {
    const updated = todos.map((t) => {
      if (compare(t.id, id)) {
        t.done = forceDone !== undefined ? forceDone : !t.done;
      }
      return t;
    });
    saveTodos(updated);
  }

  function deleteItem(id: string) {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
  }

  function deleteDone() {
    if (!todos.some((t) => t.done)) return;
    const updated = todos.filter((t) => t.done === false);
    saveTodos(updated);
  }

  function saveTodos(todos: TodoItem[]) {
    setTodos(todos);
    storage.set("todo", todos, OneYearMs);
    if (isExtension) {
      chrome.storage.local.set({
        todos,
      });
    }
  }

  useEffect(() => {
    setUndoneTodos(todos.some((n) => n.done === false));
  }, [todos]);

  return (
    <Panel isActive={activePanel === "todo"}>
      <PanelHeader title={t("todo.header")} onClose={closePanel} />
      <PanelBody>
        {!todos.length && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <p className="text-sm dark:text-white/70 text-gray-600 flex-1">
              {t("todo.noItems")}
            </p>
          </div>
        )}
        {todos?.map((item) => (
          <TodoListItem
            key={item.id}
            item={item}
            toggleDone={toggleDone}
            deleteItem={deleteItem}
          />
        ))}
      </PanelBody>
      {todos.length > 0 && (
        <div className="flex justify-center items-center px-auto py-2.5">
          <Button label={t("todo.removeDoneLabel")} onClick={deleteDone} />
        </div>
      )}
      <AddTodoItem addItem={addItem} />
    </Panel>
  );
}
