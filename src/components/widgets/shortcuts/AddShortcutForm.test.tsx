import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddShortcutForm from './AddShortcutForm';

describe('AddShortcutModal', () => {
  test('render', () => {
    // Arrange
    const props = {
      id: 'AddShortcutModalId',
      addShortcut: () => {},
    };
    render(<AddShortcutForm {...props} />, { wrapper: BrowserRouter });

    // Act
    const urlInput = screen.getByPlaceholderText('https://company.com');
    const nameInput = screen.getByPlaceholderText('Name of the shortcut');

    // Assert
    expect(urlInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });
});
