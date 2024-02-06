import { CacheApi } from '../../../utils/cache/CacheApi';
import { ShortcutsService } from './ShortcutsService';
import { ShortcutData } from './ShortcutsWidget';

describe('ShortcutsService', () => {
  jest.mock('../../../utils/cache/CacheApi');
  const service: ShortcutsService = new ShortcutsService(new CacheApi());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('get -> should get shortcut data', () => {
    // Arrange
    const data: ShortcutData[] = [
      {
        name: 'Shortcut1',
        url: '',
        clicks: 0,
      },
    ];
    service.update(data);

    // Act
    const shortcut = service.get(data[0].name);

    // Assert
    expect(shortcut).toEqual(data[0]);
  });

  test('load -> should load all shortcuts', () => {
    // Arrange
    const data: ShortcutData[] = [
      {
        name: 'Shortcut1',
        url: '',
        clicks: 0,
      },
      {
        name: 'Shortcut2',
        url: '',
        clicks: 0,
      },
    ];
    service.update(data);

    // Act
    const shortcuts = service.load();

    // Assert
    expect(shortcuts).toEqual(data);
  });

  test('update -> should update shortcuts data', () => {
    // Arrange
    const data: ShortcutData[] = [
      {
        name: 'Shortcut1',
        url: '',
        clicks: 1,
      },
      {
        name: 'Shortcut2',
        url: '',
        clicks: 2,
      },
      {
        name: 'Shortcut3',
        url: '',
        clicks: 3,
      },
    ];

    // Act
    service.update(data);

    // Assert
    expect(service.load()).toEqual(data);
  });
});
