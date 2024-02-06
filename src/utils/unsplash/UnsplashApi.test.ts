import { UnsplashApi } from './UnsplashApi';

describe('UnsplashApi', () => {
  jest.mock('../cache/CacheApi');
  jest.mock('../ConfigService');
  const service: UnsplashApi = new UnsplashApi();

  test('getRandomFromCollection', async () => {
    // Arrange
    const collectionId = 'dPrbbsYeca0';

    // Act
    const url = await service.getRandomFromCollection(collectionId);

    // Assert
    expect(url).toBeDefined();
  });

  test('getRandom -> should get random url', () => {
    // Arrange
    // Act
    const url = service.getRandom(false);

    // Assert
    expect(url).toBeDefined();
  });
});
