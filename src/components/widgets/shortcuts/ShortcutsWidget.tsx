import { useEffect, useState } from 'react';
import { ShortcutsService } from './ShortcutsService';
import Shortcut from './Shortcut';
import AddShortcutForm from './AddShortcutForm';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { useGlobalState } from '../../../hooks/useGlobalState';
import { useModal } from '../../../hooks/useModal';
import { ModalTypeEnum } from '../../../utils/ModalContext';

import imgAddIcon from '../../../assets/img/icons/icon-plus-circle.svg';

export interface ShortcutData {
  url: string;
  name: string;
  clicks: number;
}

function ShortcutsWidget() {
  const { globalState } = useGlobalState();
  const { setModalState } = useModal();
  const [shortcuts, setShortcuts] = useState<ShortcutData[]>([]);
  const maxCount = 9;
  const addShortcutModalId = 'add-shortcut-modal';
  const Shortcuts = new ShortcutsService(CacheApi.getInstance());

  function addShortcut(url: string, name?: string) {
    if (!name) {
      name = generateName(new URL(url).hostname);
    }

    const existingIdx = shortcuts.findIndex((s) => s.url === url);
    if (existingIdx !== -1) {
      shortcuts[existingIdx].name = name;
      hideAddModal();
      return;
    }
    if (shortcuts.length >= maxCount) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.confirm,
        prompt: `Maximum of ${maxCount} shortcuts reached! Last shortcut will be replaced. Proceed?`,
        onConfirm: () => {
          shortcuts.pop();
          shortcuts.push({
            url,
            name: name as string,
            clicks: 0,
          });
          updateShortcuts(shortcuts);
        },
        showModal: true,
      }));
    } else {
      shortcuts.push({
        url,
        name,
        clicks: 0,
      });
      updateShortcuts(shortcuts);
    }
    hideAddModal();
  }

  function updateShortcuts(shortcuts: ShortcutData[]) {
    setShortcuts([...shortcuts]);
    Shortcuts.update(shortcuts);
  }

  function showAddModal() {
    setModalState((state) => ({
      ...state,
      type: ModalTypeEnum.addShortcut,
      showModal: true,
      onRender: () => {
        return (
          <AddShortcutForm id={addShortcutModalId} addShortcut={addShortcut} />
        );
      },
    }));
  }

  function hideAddModal() {
    setModalState((state) => ({
      ...state,
      type: ModalTypeEnum.prompt,
      prompt: '',
      showModal: false,
    }));
  }

  function generateName(hostname: string): string {
    const parts = hostname.split('.');
    return parts.reduce((str, part, idx, arr) => {
      if (idx !== arr.length - 1) {
        str += part[0].toUpperCase() + part.slice(1).toLowerCase();
      }
      return str;
    }, '');
  }

  useEffect(() => {
    const data = Shortcuts.load();
    if (data) {
      setShortcuts(data);
    } else {
      setShortcuts([]);
      addShortcut('https://www.facebook.com', 'Facebook');
      addShortcut('https://www.youtube.com/', 'Youtube');
      addShortcut('https://www.espn.com/', 'Sport');
      addShortcut('https://maps.google.com', 'Maps');
    }
  }, []);

  if (!globalState.widgetShortcutsActive) {
    return <></>;
  }

  return (
    <>
      <div
        className={`relative md:w-6/12 max-w-2xl mx-auto transition-opacity duration-100 ease-in-out ${
          globalState.widgetShortcutsHidden
            ? 'animate-fadeout hidden'
            : 'animate-fadein'
        }`}
      >
        <div className="container pb-2 my-4">
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-x-6 items-center justify-center">
            <div className="flex justify-center relative">
              <button
                className="min-w-full px-6 py-5 mx-1 mb-3 rounded-lg text-xs text-center font-medium text-white transition-colors duration-150 bg-white/20 hover:bg-white/70 hover:text-gray-900 border border-gray-400 shadow-2xl backdrop-blur-sm"
                type="button"
                title="Add shortcut"
                onClick={showAddModal}
              >
                <img
                  aria-hidden="true"
                  className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 rounded-full"
                  width={globalState.mobile ? 8 : 10}
                  height={globalState.mobile ? 8 : 10}
                  src={imgAddIcon}
                  alt="+"
                />
                Add
              </button>
            </div>
            {shortcuts.map((shortcut, idx) => {
              return (
                <Shortcut
                  data={shortcut}
                  shortcuts={shortcuts}
                  updateShortcuts={updateShortcuts}
                  key={`shortcut-${idx}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShortcutsWidget;
