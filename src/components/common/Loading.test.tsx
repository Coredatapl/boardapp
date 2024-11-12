import { render, screen } from '@testing-library/react';
import Loading from './Loading';
import { BrowserRouter } from 'react-router-dom';

describe('Loading', () => {
  test('render', () => {
    // Arrange
    // Act
    render(<Loading />, { wrapper: BrowserRouter });
    const logo = screen.getByAltText('Board App');
    const loadingText = screen.getByText('Loading ...');

    // Assert
    expect(logo).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
