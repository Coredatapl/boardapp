import { useState, MouseEvent, useEffect } from 'react';
import { ShortcutData } from './ShortcutsWidget';
import { useGlobalState } from '../../../hooks/useGlobalState';
import { useModal } from '../../../hooks/useModal';
import { ModalTypeEnum } from '../../../utils/ModalContext';
import FetchApi from '../../../utils/fetch/FetchApi';

import imgDefaultIcon from '../../../assets/img/icons/icon-link.svg';

interface ShortcutProps {
  data: ShortcutData;
  shortcuts: ShortcutData[];
  updateShortcuts: (shortcuts: ShortcutData[]) => void;
}

function Shortcut({ data, shortcuts, updateShortcuts }: ShortcutProps) {
  const { globalState } = useGlobalState();
  const { setModalState } = useModal();
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [iconSrc, setIconSrc] = useState('');
  const nameMaxLength = globalState.widgetShortcutsNameMaxLength as number;
  const WebApi = FetchApi.getInstance();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    data.clicks++;

    const sorted = [...shortcuts].sort((a, b) => b.clicks - a.clicks);
    updateShortcuts(sorted);

    window.open(data.url, '_self');
  }

  function deleteShortcut(shortcut: ShortcutData) {
    const filtered = [...shortcuts].filter((s) => s !== shortcut);
    setModalState((state) => ({
      ...state,
      type: ModalTypeEnum.confirm,
      prompt: `Delete ${shortcut.name} shortcut permanently?`,
      onConfirm: () => {
        updateShortcuts([...filtered]);
      },
      showModal: true,
    }));
  }

  async function fetchIcon(url: string) {
    const response = (await WebApi.fetch(
      `https://icon.horse/icon/${new URL(url).hostname}?size=small`,
      {
        method: 'GET',
        //cache: 'force-cache',
      }
    )) as Response;

    if (response) {
      const image = await response.blob();
      setIconSrc(URL.createObjectURL(image));
      return;
    }
    setIconSrc(imgDefaultIcon);
  }

  useEffect(() => {
    setIconSrc(imgDefaultIcon);
    fetchIcon(data.url);
  }, [data.url]);

  // TODO: fix touch events on mobile devices
  return (
    <div
      className="flex justify-center relative"
      onMouseEnter={() => setShowDeleteButton(true)}
      onTouchStart={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      onTouchEnd={() => setShowDeleteButton(false)}
    >
      <a
        href={data.url}
        className="min-w-full px-6 py-5 mx-1 mb-3 rounded-lg text-xs text-center font-medium text-white transition-colors duration-150 bg-white/20 hover:bg-white/70 hover:text-gray-900 border border-gray-400 shadow-2xl backdrop-blur-sm"
        target="_blank"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => onClick(e)}
      >
        <img
          aria-hidden="true"
          className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 p-1 rounded-full bg-white"
          width={globalState.mobile ? 8 : 10}
          height={globalState.mobile ? 8 : 10}
          src={iconSrc}
          alt=""
        />
        {data.name.substring(0, nameMaxLength)}
        {data.name.length > nameMaxLength ? '...' : ''}
      </a>
      <button
        className={`${
          !showDeleteButton ? 'hidden ' : ''
        }absolute right-0 top-0 w-8 h-8 m-0 p-0 inline-flex rounded-bl-lg items-center justify-center transition-colors duration-150 text-pink-100 bg-gray-600 hover:bg-red-600`}
        title="Delete shortcut"
        onClick={() => deleteShortcut(data)}
      >
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Shortcut;
