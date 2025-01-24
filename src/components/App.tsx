import { StrictMode, Suspense, useState } from 'react';
import {
  GlobalStateContext,
  defaultGlobalState,
} from '../utils/GlobalStateContext';
import { ModalStateContext, defaultModalState } from '../utils/ModalContext';
import {
  defaultNotificationsState,
  NotificationsStateContext,
} from '../utils/NotificationsContext';
import Modal from './common/Modal';
import Loading from './common/Loading';
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

export default function App() {
  const [globalState, setGlobalState] = useState(defaultGlobalState);
  const [modalState, setModalState] = useState(defaultModalState);
  const [notificationsState, setNotificationsState] = useState(
    defaultNotificationsState
  );

  return (
    <StrictMode>
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <ModalStateContext.Provider value={{ modalState, setModalState }}>
          <NotificationsStateContext.Provider
            value={{ notificationsState, setNotificationsState }}
          >
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
          </NotificationsStateContext.Provider>
        </ModalStateContext.Provider>
      </GlobalStateContext.Provider>
    </StrictMode>
  );
}
