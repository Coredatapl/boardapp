import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useUtil } from '../../../utils/useUtil';
import { SearchEngineEnum } from './SearchService';

import imgIconGoogle from '../../../assets/img/icons/icon-logo-google.svg';
import imgIconBing from '../../../assets/img/icons/icon-logo-bing.svg';

interface SearchEngineSelectorWidgetProps {
  searchEngine: SearchEngineEnum;
  setSearchEngine: Dispatch<SetStateAction<SearchEngineEnum>>;
}

export default function SearchEngineSelector({
  searchEngine,
  setSearchEngine,
}: SearchEngineSelectorWidgetProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const widgetButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { targetInside } = useUtil();
  const engineIcon: Record<SearchEngineEnum, string> = {
    [SearchEngineEnum.Google]: imgIconGoogle,
    [SearchEngineEnum.Bing]: imgIconBing,
  };

  function selectSearchEngine(engine: SearchEngineEnum) {
    setSearchEngine(engine);
    setShowDropdown(false);
  }

  function handleClick(event: MouseEvent) {
    if (
      !widgetButtonRef.current ||
      !dropdownRef.current ||
      !event.target ||
      targetInside(event.target, widgetButtonRef.current)
    ) {
      return;
    }
    if (!targetInside(event.target, dropdownRef.current)) {
      setShowDropdown(false);
    }
  }

  function toggleShowDropdown() {
    setShowDropdown(!showDropdown);
  }

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <>
      <button
        ref={widgetButtonRef}
        className="absolute top-0 right-0 h-full p-2.5 z-10 inline-flex items-center rounded-r-lg text-sm font-medium text-center text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none"
        type="button"
        onClick={toggleShowDropdown}
      >
        <img className="w-3 h-3 mr-2" src={engineIcon[searchEngine]} />
        <p className="min-w-45-px text-left">{searchEngine}</p>
        <svg
          className="w-3 h-3 ml-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          ></path>
        </svg>
      </button>

      {showDropdown && (
        <div
          className="absolute top-0 right-0 w-44 z-10 translate-y-12 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow"
          ref={dropdownRef}
        >
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="dropdown-button-2"
          >
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                role="menuitem"
                onClick={() => selectSearchEngine(SearchEngineEnum.Google)}
              >
                <div className="inline-flex items-center">
                  <img
                    className="w-3 h-3 mr-2"
                    src={engineIcon[SearchEngineEnum.Google]}
                  />
                  Google
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                role="menuitem"
                onClick={() => selectSearchEngine(SearchEngineEnum.Bing)}
              >
                <div className="inline-flex items-center">
                  <img
                    className="w-3 h-3 mr-2"
                    src={engineIcon[SearchEngineEnum.Bing]}
                  />
                  Bing
                </div>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
