import { render, screen } from '@testing-library/react';
import { Dispatch, SetStateAction } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../../utils/GlobalStateContext';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;

  test('render', () => {
    // Arrange
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <SearchBar />
      </GlobalStateContext.Provider>,
      { wrapper: BrowserRouter }
    );

    // Act
    const searchQueryInput = screen.getByPlaceholderText('Search the web...');

    // Assert
    expect(searchQueryInput).toBeInTheDocument();
    expect(searchQueryInput).toHaveAttribute('id', 'searchQueryInput');
    expect(searchQueryInput).toHaveAttribute('type', 'text');
  });
});
