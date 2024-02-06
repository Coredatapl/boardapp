import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddShortcutModal from './AddShortcutModal';

describe('AddShortcutModal', () => {
  test('render', () => {
    // Arrange
    const props = {
      id: 'AddShortcutModalId',
      showModal: true,
      setShowModal: () => {},
      addShortcut: () => {},
    };
    render(<AddShortcutModal {...props} />, { wrapper: BrowserRouter });

    // Act
    const header = screen.getByText('Add new Shortcut');
    const urlInput = screen.getByPlaceholderText('https://company.com');
    const nameInput = screen.getByPlaceholderText('Name of the shortcut');

    // Assert
    expect(header).toBeInTheDocument();
    expect(urlInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });
});
