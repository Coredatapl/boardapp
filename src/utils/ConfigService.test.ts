import { ConfigKey, ConfigService, ConfigValue } from './ConfigService';
import { CacheApi } from './cache/CacheApi';

describe('ConfigService', () => {
  jest.mock('./cache/CacheApi');
  const service: ConfigService = new ConfigService(new CacheApi());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('get -> should get config param value', () => {
    // Arrange
    const appName = ConfigKey.appName;

    // Act
    const value = service.get(appName) as ConfigValue;

    // Assert
    expect(value).toEqual('Board App');
  });

  test('set -> should set config param value', () => {
    // Arrange
    const appName = ConfigKey.appName;
    const newValue = 'test';

    // Act
    service.set(appName, newValue);

    // Assert
    expect(service.get(appName)).toEqual(newValue);
  });
});
