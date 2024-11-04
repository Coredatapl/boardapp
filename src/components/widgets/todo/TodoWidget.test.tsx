import { render, screen } from '@testing-library/react';
import { SetStateAction, Dispatch } from 'react';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../../utils/GlobalStateContext';
import TodoWidget from './TodoWidget';
import { BrowserRouter } from 'react-router-dom';

describe('TodoWidget', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;
  const setTopbarOpen = (() => {}) as React.Dispatch<
    React.SetStateAction<boolean>
  >;

  test('render', () => {
    // Arrange
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <TodoWidget setTopbarOpen={setTopbarOpen} />
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );

    // Act
    const todoLink = screen.getByText('Todo');
    const header = screen.getByText('Todo list');
    const newInput = screen.getByPlaceholderText('New item name');

    // Assert
    expect(todoLink).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(newInput).toBeInTheDocument();
  });
});
