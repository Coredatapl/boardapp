import { CacheApi } from '../../../utils/cache/CacheApi';
import { SearchEngineEnum, SearchService } from './SearchService';

describe('SearchService', () => {
  jest.mock('../../../utils/cache/CacheApi');
  const service: SearchService = new SearchService(CacheApi.getInstance());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('saveQuery -> should save new query', () => {
    // Arrange
    const testQuery = 'test query';

    // Act
    service.saveQuery(testQuery);

    // Assert
    expect(service.getQueryHistory()).toContain(testQuery);
  });

  test('getSimilarQueries -> should return similar query', () => {
    // Arrange
    const testQuery1 = 'test query new';
    const testQuery2 = 'another query';

    // Act
    service.saveQuery(testQuery1);
    service.saveQuery(testQuery2);
    const queries = service.getSimilarQueries('test');

    // Assert
    expect(queries).toContain(testQuery1);
  });

  test('getSearchUrl -> should return url', () => {
    // Arrange
    const engine = SearchEngineEnum.Bing;

    // Act
    const url = service.getSearchUrl(engine);

    // Assert
    expect(url).toBe('https://www.bing.com/search?q=');
  });

  test('getSearchUrl -> should throw error for unsupported engine', () => {
    // Arrange
    const getUnknownEngine = () => {
      service.getSearchUrl('Unknown' as SearchEngineEnum);
    };

    // Act
    // Assert
    expect(getUnknownEngine).toThrow(
      new Error('Unsupported search url for Unknown search engine')
    );
  });

  test('delQuery -> should delete query', () => {
    // Arrange
    const testQuery1 = 'test query 1';

    // Act
    service.saveQuery(testQuery1);
    service.delQuery(testQuery1);

    // Assert
    expect(service.getQueryHistory()).not.toContain(testQuery1);
  });
});
