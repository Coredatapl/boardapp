import { useEffect, useState, KeyboardEvent } from 'react';
import { DateTime } from '../../utils/DateTime';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks/useLoading';
import { useModal } from '../../hooks/useModal';
import { ConfigKey, ConfigService } from '../../utils/ConfigService';
import { ModalTypeEnum } from '../../utils/ModalContext';
import Loading from '../common/Loading';
import Button from '../common/Button';

import imgLogoColor from '../../assets/img/logo-color.svg';

export default function WelcomeWidget() {
  const { globalState, setGlobalState } = useGlobalState();
  const { loading } = useLoading();
  const { setModalState } = useModal();
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome');
  const [welcomeName, setWelcomeName] = useState('');
  const [showFirstStep, setShowFirstStep] = useState(false);
  const [showNextStep, setShowNextStep] = useState(false);
  const dayTime = DateTime.getDayTime();
  const Config = ConfigService.getInstance();
  const welcomeNameMinLength = Config.getValue<number>(
    ConfigKey.welcomeNameMinLength
  );
  const welcomeNameMaxLength = Config.getValue<number>(
    ConfigKey.welcomeNameMaxLength
  );

  function saveWelcomeName() {
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
      return;
    }

    Config.set(ConfigKey.welcomeName, welcomeName);
    Config.set(ConfigKey.firstRun, false);

    setGlobalState((state) => ({
      ...state,
      welcomeName,
    }));
    goNext();
  }

  function setMessage() {
    const name = globalState.welcomeName as string;
    setWelcomeMessage(`Good ${dayTime}${name.length ? ` ${name}` : ''}!`);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key;

    if (key === 'Enter') {
      saveWelcomeName();
    }
  }

  function goNext() {
    setShowFirstStep(false);
    setShowNextStep(true);
  }

  function goBack() {
    setShowNextStep(false);
    setShowFirstStep(true);
  }

  function getStarted() {
    setShowNextStep(false);
    setTimeout(() => {
      setGlobalState((state) => ({
        ...state,
        firstRun: false,
      }));
      window.location.reload();
    }, 500);
  }

  useEffect(() => {
    if (globalState.firstRun) {
      setTimeout(() => {
        setShowFirstStep(true);
      }, 1000);
    } else {
      setMessage();
    }
  }, []);

  useEffect(() => {
    setMessage();
  }, [globalState]);

  if (globalState.firstRun) {
    if (loading) {
      return (
        <div
          className={
            'absolute z-40 w-full h-full mx-auto inset-0 overflow-x-hidden overflow-y-auto text-gray-800 bg-gray-100'
          }
        >
          <Loading />
        </div>
      );
    }

    return (
      <div
        className={
          'absolute z-40 w-full h-full mx-auto inset-0 overflow-hidden text-gray-800 bg-gray-100'
        }
      >
        <div className="relative w-full h-full">
          <div
            className={
              'relative min-w-full h-screen max-h-screen flex justify-center items-center text-center transition-all ease-in-out duration-500 ' +
              (showFirstStep || showNextStep ? 'opacity-100' : 'opacity-0')
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
                (!showNextStep ? 'opacity-100' : 'opacity-0')
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
                  minLength={welcomeNameMinLength}
                  maxLength={welcomeNameMaxLength}
                  onChange={(e) => setWelcomeName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
              <p className="mt-2 mb-4 text-sm text-gray-500">
                <i
                  className="fa fa-lightbulb text-lg mr-2 text-yellow-400"
                  aria-hidden="true"
                ></i>{' '}
                The name will be used to greet you everyday so you can choose
                something creative like <i>Boss</i> :)
              </p>
              <div className="flex justify-center pt-6">
                <p className="py-2 text-xs text-gray-500">
                  Press <b>Enter</b> or click the button to proceed.
                </p>
              </div>
              <div className="relative flex z-10 justify-center">
                <Button
                  type="button"
                  title="Save"
                  style="text-white bg-green-700 hover:bg-green-600 active:bg-green-600"
                  onClick={() => saveWelcomeName()}
                />
              </div>
            </div>
            <div
              className={
                'absolute top-[calc(40%)] w-10/12 min-h-280-px mx-auto transition-all ease-in-out duration-500 ' +
                (showNextStep ? 'opacity-100' : 'opacity-0')
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
              <div className="flex gap-4 mx-10 justify-center">
                <Button
                  type="button"
                  title="Agree and get started!"
                  style="w-3/12 text-white bg-green-700 hover:bg-green-600 active:bg-green-600"
                  onClick={getStarted}
                />
                <Button
                  type="button"
                  title="Back"
                  onClick={goBack}
                  style="w-3/12 text-gray-500 bg-gray-100 hover:text-red-700 hover:bg-gray-200 active:bg-gray-100 active:shadow-none"
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
