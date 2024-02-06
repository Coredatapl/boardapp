import { useEffect, useState, KeyboardEvent } from 'react';
import { DateTime } from '../../utils/DateTime';
import { useGlobalState } from '../../utils/useGlobalState';
import { ConfigKey, ConfigService } from '../../utils/ConfigService';
import Button from '../common/Button';

import imgLogoColor from '../../assets/img/logo-color.svg';

export default function WelcomeWidget() {
  const { globalState, setGlobalState } = useGlobalState();
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome');
  const [welcomeName, setWelcomeName] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeInNext, setFadeInNext] = useState(false);
  const dayTime = DateTime.getDayTime();
  const minWelcomeNameLength = 3;
  const Config = ConfigService.getInstance();

  function saveWelcomeName() {
    const name = (
      document.getElementById('welcomeNameInput') as HTMLInputElement
    ).value;

    Config.set(ConfigKey.welcomeName, name);
    Config.set(ConfigKey.firstRun, false);

    setGlobalState((state) => ({
      ...state,
      welcomeName: name,
    }));
    setFadeInNext(true);
  }

  function setMessage() {
    const name = globalState.welcomeName as string;
    setWelcomeMessage(`Good ${dayTime}${name.length ? ` ${name}` : ''}!`);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key;

    if (welcomeName.length < minWelcomeNameLength) {
      // warning info
      return;
    }

    if (key === 'Enter') {
      saveWelcomeName();
    }
  }

  function getStarted() {
    setGlobalState((state) => ({
      ...state,
      firstRun: false,
    }));
    setFadeInNext(false);
  }

  useEffect(() => {
    if (globalState.firstRun) {
      window.addEventListener('load', () => setFadeIn(true));
    } else {
      setMessage();
    }
  }, [globalState]);

  if (globalState.firstRun) {
    return (
      <div
        className={
          'absolute z-40 w-full h-full mx-auto p-4 inset-0 overflow-x-hidden overflow-y-auto text-gray-800 bg-gray-100'
        }
      >
        <div className="relative w-full h-full">
          <div
            className={
              'relative min-w-full h-screen p-4 flex justify-center items-center text-center transition-all ease-in-out duration-500 ' +
              (fadeIn ? 'opacity-100' : 'opacity-0')
            }
          >
            <div className="absolute top-[calc(40%-100px)] m-auto mb-4 py-4">
              <img
                alt={globalState.appName as string}
                className="w-28 mx-auto text-2xl text-shadow-xs shadow-gray-700"
                src={imgLogoColor}
                width={112}
                height={20}
              />
            </div>
            <div
              className={
                'absolute top-[calc(40%)] mx-auto min-h-280-px transition-all ease-in-out duration-500 ' +
                (!fadeInNext ? 'opacity-100' : 'opacity-0')
              }
            >
              <h1 className="w-full text-xl md:text-2xl">Hello!</h1>
              <h2 className="w-full mb-8 text-base md:text-lg">
                Welcome to Board App. This is your first run so let's get
                started!
              </h2>
              <div
                className={`relative flex min-w-300-px h-12 z-10 mx-auto items-center bg-white/70 text-gray-800 border border-gray-200 hover:bg-white hover:text-gray-700 focus:bg-white shadow-lg rounded-lg`}
              >
                <input
                  className="peer w-full h-full outline-none text-lg px-4 bg-transparent"
                  type="text"
                  id="welcomeNameInput"
                  placeholder={`What's your name?`}
                  value={welcomeName}
                  minLength={minWelcomeNameLength}
                  onChange={(e) => setWelcomeName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
              <div className="flex justify-center pt-6">
                <p className="text-xs text-gray-500">
                  Press <b>Enter</b> to proceed.
                </p>
              </div>
            </div>
            <div
              className={
                'absolute top-[calc(40%)] mx-auto min-h-280-px transition-all ease-in-out duration-500 ' +
                (fadeInNext ? 'opacity-100' : 'opacity-0')
              }
            >
              <h2 className="w-full text-base md:text-lg">
                To take full advantage of the app's features, such as weather
                information, we ask you to agree to share your location.
              </h2>
              <h2 className="w-full mb-8 text-base md:text-lg">
                The application does not collect any personal data. Your data is
                only available locally in your browser.
              </h2>
              <div className="flex justify-center">
                <Button
                  type="button"
                  title="Agree and get started!"
                  style="text-white bg-green-700 hover:bg-green-600 active:bg-green-600"
                  onClick={getStarted}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-6/12 max-w-2xl mx-auto flex items-center text-center">
      <h1 className="w-full mb-8 text-2xl md:text-4xl lg:text-6xl text-shadow-xs shadow-gray-700">
        {welcomeMessage}
      </h1>
    </div>
  );
}
