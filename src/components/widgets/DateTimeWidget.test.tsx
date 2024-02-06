import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import DateTimeWidget from './DateTimeWidget';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../utils/GlobalStateContext';

describe('DateTimeWidget', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;

  test('render', () => {
    // Arrange
    // Act
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <DateTimeWidget />
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );
    const timeHeader = screen.getByTestId('timeHeader');
    const dateHeader = screen.getByTestId('dateHeader');

    // Assert
    expect(timeHeader).toBeInTheDocument();
    expect(dateHeader).toBeInTheDocument();
  });
});
