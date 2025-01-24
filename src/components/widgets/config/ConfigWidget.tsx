import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../hooks/useGlobalState';
import { useModal } from '../../../hooks/useModal';
import { useUtil } from '../../../hooks/useUtil';
import {
  ConfigKey,
  ConfigService,
  ConfigValue,
} from '../../../utils/ConfigService';
import { ModalTypeEnum } from '../../../utils/ModalContext';
import IconButton from '../../common/IconButton';
import Toggle from '../../common/Toggle';

import imgSaveIcon from '../../../assets/img/icons/icon-save.svg';

export default function ConfigWidget() {
  const { globalState, setGlobalState } = useGlobalState();
  const [showWidget, setShowWidget] = useState(false);
  const { targetInside } = useUtil();
  const { setModalState } = useModal();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetLinkRef = useRef<HTMLAnchorElement>(null);
  const Config = ConfigService.getInstance();
  const welcomeNameMinLength = Config.getValue<number>(
    ConfigKey.welcomeNameMinLength
  );
  const welcomeNameMaxLength = Config.getValue<number>(
    ConfigKey.welcomeNameMaxLength
  );

  function toggleShowWidget() {
    setShowWidget(!showWidget);
  }

  function setConfigValue(key: ConfigKey, value: ConfigValue) {
    Config.set(key, value);

    setGlobalState((state) => ({
      ...state,
      [key]: value,
    }));
  }

  function setWelcomeName() {
    const input = document.getElementById(
      'setWelcomeNameInput'
    ) as HTMLInputElement;
    const welcomeName = input.value;

    if (
      welcomeName.length < welcomeNameMinLength ||
      welcomeName.length > welcomeNameMaxLength
    ) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.prompt,
        prompt: `The name should be a min of ${welcomeNameMinLength} and a max of ${welcomeNameMaxLength} characters.`,
        showModal: true,
      }));
      input.value = globalState.welcomeName as string;
      return;
    }

    setConfigValue(ConfigKey.welcomeName, welcomeName);
  }

  function setContactEmail() {
    const input = document.getElementById(
      'setContactEmailInput'
    ) as HTMLInputElement;
    const contactEmail = input.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!contactEmail || !emailPattern.test(contactEmail)) {
      setModalState((state) => ({
        ...state,
        type: ModalTypeEnum.prompt,
        prompt: 'Please enter a valid email address.',
        showModal: true,
      }));
      input.value = '';
      return;
    }

    setConfigValue(ConfigKey.contactEmail, contactEmail);

    if (!globalState.notificationsActive) {
      toggleSetting(ConfigKey.notificationsActive);
    }
  }

  function toggleSetting(index: ConfigKey) {
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

  useEffect(() => {}, [globalState]);

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
          className={`${
            !showWidget ? 'hidden' : 'z-30 opacity-100 animate-slidedown'
          } absolute top-4 right-0 w-80 bg-white/70 text-gray-900 rounded-lg shadow-lg transition-opacity duration-100 ease-in backdrop-blur-sm divide-y divide-gray-100`}
        >
          <div className="px-4 pt-3">
            <h3 className="pb-3 text-xl font-medium">Settings</h3>
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
            <label className="block mb-2 text-sm font-medium">Your name</label>
            <div className="relative">
              <input
                id="setWelcomeNameInput"
                type="text"
                defaultValue={globalState.welcomeName as string}
                className="block w-full p-2 pl-2 text-sm rounded-md outline-none bg-gray-50 border border-gray-400"
                placeholder="Set your name"
                minLength={welcomeNameMinLength}
                maxLength={welcomeNameMaxLength}
                required
              />
              <IconButton
                iconSrc={imgSaveIcon}
                onClick={() => setWelcomeName()}
                title="Save"
                alt="Save"
              />
            </div>
            <label className="block my-2 text-sm font-medium">
              Your email address
            </label>
            <div className="relative">
              <input
                id="setContactEmailInput"
                type="email"
                defaultValue={globalState.contactEmail as string}
                className="block w-full p-2 pl-2 text-sm rounded-md outline-none bg-gray-50 border border-gray-400"
                placeholder="Set your email address"
                required
              />
              <IconButton
                iconSrc={imgSaveIcon}
                onClick={() => setContactEmail()}
                title="Save"
                alt="Save"
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleNotifications'}
                label={'Email notifications'}
                defaultValue={globalState.notificationsActive as boolean}
                onChange={() => toggleSetting(ConfigKey.notificationsActive)}
              />
            </div>
            <label className="block mt-4 text-sm font-medium">Widgets</label>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleWeatherWidget'}
                label={'Weather widget active'}
                defaultValue={globalState.widgetWeatherActive as boolean}
                onChange={() => toggleSetting(ConfigKey.widgetWeatherActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleDatetimeWidget'}
                label={'Datetime widget active'}
                defaultValue={globalState.widgetDatetimeActive as boolean}
                onChange={() => toggleSetting(ConfigKey.widgetDatetimeActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleShortcutsWidget'}
                label={'Shortcuts widget active'}
                defaultValue={globalState.widgetShortcutsActive as boolean}
                onChange={() => toggleSetting(ConfigKey.widgetShortcutsActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleMapWidget'}
                label={'Map widget active'}
                defaultValue={globalState.widgetMapActive as boolean}
                disabled={true}
                onChange={() => toggleSetting(ConfigKey.widgetMapActive)}
              />
            </div>
            <div className="flex items-center mt-1 pl-2">
              <Toggle
                name={'toggleTodoWidget'}
                label={'Todo widget active'}
                defaultValue={globalState.widgetTodoActive as boolean}
                onChange={() => toggleSetting(ConfigKey.widgetTodoActive)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
