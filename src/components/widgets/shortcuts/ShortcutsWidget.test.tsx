import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import ShortcutsWidget from './ShortcutsWidget';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../../utils/GlobalStateContext';

describe('ShortcutsWidget', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;
  test('render', () => {
    // Arrange
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <ShortcutsWidget />
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );

    // Act
    const addButton = screen.getByTitle('Add shortcut');

    // Assert
    expect(addButton).toBeInTheDocument();
  });
});
