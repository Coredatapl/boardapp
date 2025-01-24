import { render, screen } from '@testing-library/react';
import { Dispatch, SetStateAction } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Topbar from './Topbar';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../utils/GlobalStateContext';
import {
  defaultNotificationsState,
  NotificationsStateContext,
  NotificationsStateData,
} from '../utils/NotificationsContext';

describe('Topbar', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;
  const notificationsState = defaultNotificationsState;
  const setNotificationsState = (() => {}) as Dispatch<
    SetStateAction<NotificationsStateData>
  >;

  test('render', () => {
    // Arrange
    // Act
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <NotificationsStateContext.Provider
          value={{ notificationsState, setNotificationsState }}
        >
          <Topbar />
        </NotificationsStateContext.Provider>
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );
    const menubar = screen.getByRole('menubar');

    // Assert
    expect(menubar).toBeInTheDocument();
  });
});
