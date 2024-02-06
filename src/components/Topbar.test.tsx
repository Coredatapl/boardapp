import { render, screen } from '@testing-library/react';
import { Dispatch, SetStateAction } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Topbar from './Topbar';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../utils/GlobalStateContext';

describe('Topbar', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;

  test('render', () => {
    // Arrange
    // Act
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <Topbar />
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );
    const menubar = screen.getByRole('menubar');

    // Assert
    expect(menubar).toBeInTheDocument();
  });
});
