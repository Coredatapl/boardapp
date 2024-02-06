import { render, screen } from '@testing-library/react';
import QueryHistoryListItem from './QueryHistoryListItem';
import { BrowserRouter } from 'react-router-dom';

describe('QueryHistoryListItem', () => {
  test('render', () => {
    // Arrange
    const query = 'test query';
    const useSimilarQuery = jest.fn();
    const deleteQuery = jest.fn();

    // Act
    render(
      <QueryHistoryListItem
        query={query}
        useSimilarQuery={useSimilarQuery}
        deleteQuery={deleteQuery}
      />,
      { wrapper: BrowserRouter }
    );
    const queryValue = screen.getByText(query);

    // Assert
    expect(queryValue).toBeInTheDocument();
  });

  test('deleteQuery', () => {
    // Arrange
    const query = 'test query';
    const useSimilarQuery = jest.fn();
    const deleteQuery = jest.fn().mockImplementation((query: string) => {
      history = history.filter((v) => v !== query);
    });
    let history: string[] = [query];

    // Act
    render(
      <QueryHistoryListItem
        query={query}
        useSimilarQuery={useSimilarQuery}
        deleteQuery={deleteQuery}
      />,
      { wrapper: BrowserRouter }
    );
    const deleteLink = screen.getByTitle('Delete query');
    deleteLink.click();

    // Assert
    expect(history).toEqual([]);
  });
});
