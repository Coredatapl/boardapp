import { CacheApi } from '../../../utils/cache/CacheApi';
import { TodoService } from './TodoService';
import { TodoItemData } from './TodoWidget';

describe('TodoService', () => {
  jest.mock('../../../utils/cache/CacheApi');
  const service: TodoService = new TodoService(CacheApi.getInstance());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('load -> should load todo items', () => {
    // Arrange
    const data: TodoItemData[] = [
      { name: 'Todo1', done: false, added: new Date().toISOString() },
    ];
    service.update(data);

    // Act
    const todos = service.load();

    // Assert
    expect(todos).toEqual(data);
  });

  test('update -> should update todo items', () => {
    // Arrange
    const data: TodoItemData[] = [
      { name: 'Todo1', done: true, added: new Date().toISOString() },
      { name: 'Todo2', done: false, added: new Date().toISOString() },
    ];

    // Act
    service.update(data);

    // Assert
    expect(service.load()).toEqual(data);
  });
});
