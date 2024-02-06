import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../utils/useGlobalState';
import { ConfigKey, ConfigService } from '../../../utils/ConfigService';
import { useUtil } from '../../../utils/useUtil';
import Checkbox from '../../common/Checkbox';
import IconButton from '../../common/IconButton';

import imgSaveIcon from '../../../assets/img/icons/icon-save.svg';

export default function ConfigWidget() {
  const { globalState, setGlobalState } = useGlobalState();
  const [showWidget, setShowWidget] = useState(false);
  const { targetInside } = useUtil();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetLinkRef = useRef<HTMLAnchorElement>(null);
  const Config = ConfigService.getInstance();

  function toggleShowWidget() {
    setShowWidget(!showWidget);
  }

  function setWelcomeName() {
    const input = document.getElementById(
      'setWelcomeNameInput'
    ) as HTMLInputElement;

    if (!input.value.length) {
      return;
    }

    Config.set(ConfigKey.welcomeName, input.value);

    setGlobalState((state) => ({
      ...state,
      [ConfigKey.welcomeName]: input.value,
    }));
  }

  function toggleWidget(index: ConfigKey) {
    const active = globalState[index] as boolean;

    Config.set(index, !active);

    setGlobalState((state) => ({
      ...state,
      [index]: !active,
    }));
  }

  function handleClickOutside(event: MouseEvent) {
    if (
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
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <Link
        ref={widgetLinkRef}
        to="/"
        className="text-white/80 hover:text-white text-base leading-relaxed inline-block py-2 whitespace-nowrap text-shadow-xs shadow-gray-700"
        onClick={toggleShowWidget}
        title={'Settings'}
      >
        <i className="fa fa-sliders" aria-hidden="true"></i>
      </Link>

      <div className="relative left-0" ref={widgetRef}>
        <div
          className={`z-10${
            !showWidget ? ' hidden' : ''
          } absolute top-4 right-0 bg-white/70 text-gray-900 rounded-lg shadow-lg w-60 backdrop-blur-sm divide-y divide-gray-100`}
        >
          <div className="px-4 pt-3">
            <h3 className="pb-3 text-xl font-medium">Settings</h3>
          </div>
          <div className="px-4 py-3">
            <label className="block mb-2 text-sm font-medium">Your name</label>
            <div className="relative">
              <input
                id="setWelcomeNameInput"
                type="text"
                defaultValue={globalState.welcomeName as string}
                className="block w-full p-2 pl-2 text-sm rounded-md outline-none bg-gray-50 border border-gray-200"
                placeholder="Set your name"
                minLength={3}
                maxLength={20}
                required
              />
              <IconButton
                iconSrc={imgSaveIcon}
                onClick={() => setWelcomeName()}
                title="Save"
                alt="Save"
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Checkbox
                name={'toggleWeatherWidget'}
                label={'Weather widget active'}
                defaultValue={globalState.widgetWeatherActive as boolean}
                onChange={() => toggleWidget(ConfigKey.widgetWeatherActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Checkbox
                name={'toggleDatetimeWidget'}
                label={'Datetime widget active'}
                defaultValue={globalState.widgetDatetimeActive as boolean}
                onChange={() => toggleWidget(ConfigKey.widgetDatetimeActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Checkbox
                name={'toggleShortcutsWidget'}
                label={'Shortcuts widget active'}
                defaultValue={globalState.widgetShortcutsActive as boolean}
                onChange={() => toggleWidget(ConfigKey.widgetShortcutsActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Checkbox
                name={'toggleMapWidget'}
                label={'Map widget active'}
                defaultValue={globalState.widgetMapActive as boolean}
                onChange={() => toggleWidget(ConfigKey.widgetMapActive)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
