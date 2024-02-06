import { StrictMode, Suspense, useState } from 'react';
import {
  GlobalStateContext,
  defaultGlobalState,
} from '../utils/GlobalStateContext';
import AppView from './AppView';
import Footer from './Footer';
import Topbar from './Topbar';
import Workspace from './Workspace';
import SearchBar from './widgets/search/SearchBar';
import WeatherWidget from './widgets/WeatherWidget';
import DateTimeWidget from './widgets/DateTimeWidget';
import WelcomeWidget from './widgets/WelcomeWidget';
import ShortcutsWidget from './widgets/shortcuts/ShortcutsWidget';
import MapWidget from './widgets/MapWidget';
import Modal from './common/Modal';
import { ModalStateContext, defaultModalState } from '../utils/ModalContext';
import Loading from './common/Loading';

export default function App() {
  const [globalState, setGlobalState] = useState(defaultGlobalState);
  const [modalState, setModalState] = useState(defaultModalState);

  return (
    <StrictMode>
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <ModalStateContext.Provider value={{ modalState, setModalState }}>
          <Suspense fallback={<Loading />}>
            <AppView>
              <Topbar />
              <Workspace>
                <WelcomeWidget />
                <SearchBar />
                <ShortcutsWidget />
              </Workspace>
              <Footer>
                <WeatherWidget />
                <DateTimeWidget />
              </Footer>
              <Modal />
            </AppView>
          </Suspense>
        </ModalStateContext.Provider>
      </GlobalStateContext.Provider>
    </StrictMode>
  );
}
