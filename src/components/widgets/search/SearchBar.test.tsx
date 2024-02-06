import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  test('render', () => {
    // Arrange
    render(<SearchBar />, { wrapper: BrowserRouter });

    // Act
    const searchQueryInput = screen.getByPlaceholderText('Search the web...');

    // Assert
    expect(searchQueryInput).toBeInTheDocument();
    expect(searchQueryInput).toHaveAttribute('id', 'searchQueryInput');
    expect(searchQueryInput).toHaveAttribute('type', 'text');
  });
});
