import { useState } from 'react';
import { useGlobalState } from '../hooks/useGlobalState';
import TopbarSpacer from './common/TopbarSpacer';
import TopbarItem from './common/TopbarItem';
import ConfigWidget from './widgets/config/ConfigWidget';
import TodoWidget from './widgets/todo/TodoWidget';

import imgLogoLight from '../assets/img/logo-light.svg';

function Topbar() {
  const { globalState } = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 z-20 h-[100px] w-full pt-4 pb-8 py-3 text-white/80 hover:text-white bg-gradient-to-b from-black/60`}
      role="menubar"
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-auto static block justify-start">
          <div className="flex flex-row list-none mr-auto">
            <div className="flex items-center mr-4 py-2">
              <img
                alt={globalState.appName as string}
                className={
                  'max-w-full w-28 mx-auto text-2xl text-shadow-xs shadow-gray-700' +
                  (globalState.firstRun ? ' absolute z-50 block' : '')
                }
                src={imgLogoLight}
                width={112}
                height={20}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-grow items-center">
          <ul className="flex flex-row list-none ml-auto">
            <TopbarItem>
              <TodoWidget setTopbarOpen={setIsOpen} />
            </TopbarItem>
            <TopbarSpacer />
            <TopbarItem>
              <ConfigWidget />
            </TopbarItem>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
