import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import ShortcutsWidget from './ShortcutsWidget';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../../utils/GlobalStateContext';
import {
  ModalStateContext,
  ModalStateData,
  defaultModalState,
} from '../../../utils/ModalContext';

describe('ShortcutsWidget', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;
  const modalState = defaultModalState;
  const setModalState = (() => {}) as Dispatch<SetStateAction<ModalStateData>>;

  test('render', () => {
    // Arrange
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <ModalStateContext.Provider value={{ modalState, setModalState }}>
          <ShortcutsWidget />
        </ModalStateContext.Provider>
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );

    // Act
    const addButton = screen.getByTitle('Add shortcut');

    // Assert
    expect(addButton).toBeInTheDocument();
  });
});
