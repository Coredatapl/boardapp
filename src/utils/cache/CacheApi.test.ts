import { CacheApi, CacheItem } from './CacheApi';

describe('CacheApi', () => {
  const mockLocalStorage = (() => {
    let store = {} as Storage;

    return {
      getItem(key: string) {
        return store[key];
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {} as Storage;
      },
    };
  })();
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: mockLocalStorage,
  });
  const service = CacheApi.getInstance();
  const prefix = 'boardapp-';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('get -> should get item data', () => {
    // Arrange
    const testKey = 'testKey';
    const testValue: CacheItem = {
      value: JSON.stringify('testValue'),
      expire: Date.now() + 5000,
    };
    const getItemSpy = jest
      .spyOn(window.localStorage, 'getItem')
      .mockReturnValue(JSON.stringify(testValue));

    // Act
    const value = service.get(testKey);

    // Assert
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith(`${prefix}${testKey}`);
    expect(value).toEqual(testValue);
  });

  test('getData -> should get data of a type', () => {
    // Arrange
    const testKey = 'testKey1';
    const testValue = 'testValue1';
    const cacheItem: CacheItem = {
      value: JSON.stringify(testValue),
      expire: Date.now() + 5000,
    };
    const getSpy = jest.spyOn(service, 'get').mockReturnValue(cacheItem);

    // Act
    const value = service.getData<string>(testKey);

    // Assert
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(testKey);
    expect(value).toEqual(testValue);
  });

  test('set -> should set new cache item', () => {
    // Arrange
    const testKey = 'testKey2';
    const cacheItem: CacheItem = {
      value: JSON.stringify('testValue2'),
      expire: Date.now() + 5000,
    };
    const setItemSpy = jest.spyOn(window.localStorage, 'setItem');

    // Act
    service.set(testKey, cacheItem);

    // Assert
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      `${prefix}${testKey}`,
      JSON.stringify(cacheItem)
    );
  });
});
