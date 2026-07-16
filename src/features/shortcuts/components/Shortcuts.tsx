import { useRef } from "react";
import { useAppContext } from "@/app/AppContext";
import { usePanel } from "@/components/ui/panel/hooks/usePanel";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { compare } from "@/utils/common";
import { OneYearMs } from "@/utils/time";
import type { Shortcut } from "../types/shortcut";
import AddButton from "./AddButton";
import ShortcutItem from "./ShortcutItem";

export default function Shortcuts() {
  const { isExtension, editMode, setEditMode, shortcuts, setShortcuts } =
    useAppContext();
  const { t } = useTranslate();
  const logger = useLogger("Shortcuts");
  const storage = useStorage();
  const { activePanel } = usePanel();
  const shortcutsContainerRef = useRef<HTMLDivElement>(null);

  void useClickOutside([shortcutsContainerRef], () => {
    if (editMode && activePanel !== "settings") {
      setEditMode(false);
    }
  });

  function addShortcut(shortcut: Shortcut) {
    // TODO: max shortcuts limis?
    const existingItem = shortcuts.find((s) => compare(s.url, shortcut.url));
    if (existingItem) {
      updateShortcut(existingItem.id, {
        name: shortcut.name,
        created: shortcut.created,
      });
      logger.log(`Existing "${existingItem.name}" shortcut`, "refreshed");
      return;
    }

    const updated = [...shortcuts, shortcut];
    saveShortcuts(updated);
  }

  function updateShortcut(id: string, params: Partial<Shortcut>) {
    const updated = shortcuts.map((s) => {
      if (compare(s.id, id)) {
        return { ...s, ...params };
      }
      return s;
    });
    saveShortcuts(updated);
  }

  function deleteShortcut(id: string) {
    const updated = shortcuts.filter((sc) => sc.id !== id);
    saveShortcuts(updated);
  }

  function saveShortcuts(shortcuts: Shortcut[]) {
    const sorted = [...shortcuts].sort((a, b) => b.clicks - a.clicks);
    setShortcuts(sorted);
    storage.set("shortcuts", sorted, OneYearMs);
    if (isExtension) {
      chrome.storage.local.set({
        shortcuts: sorted,
      });
    }
  }

  return (
    <div
      ref={shortcutsContainerRef}
      className={`${editMode ? "edit-mode" : ""} relative z-0 opacity-0 animate-slide-up delay-1 fill-mode-forwards`}
    >
      <div className="grid grid-cols-5 gap-6" id="shortcuts">
        {shortcuts?.map((shortcut) => (
          <ShortcutItem
            key={shortcut.id}
            shortcut={shortcut}
            updateShortcut={updateShortcut}
            deleteShortcut={deleteShortcut}
          />
        ))}
        <AddButton addShortcut={addShortcut} />
      </div>
      <p
        className={`${editMode ? "opacity-100" : "opacity-0"} pointer-events-none select-none text-xs text-center dark:text-white/30 text-gray-400 mt-4 transition-opacity duration-200`}
      >
        {t("shortcuts.editHint.part1")}{" "}
        <span className="dark:text-white/50 text-gray-500 font-medium">✕</span>{" "}
        {t("shortcuts.editHint.part2")}
        &nbsp;·&nbsp;
        {t("shortcuts.editHint.part3")}
      </p>
    </div>
  );
}
