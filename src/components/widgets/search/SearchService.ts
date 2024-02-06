import { CacheApi } from '../../../utils/cache/CacheApi';
import { matchByWords } from '../../../utils/common';

export enum SearchEngineEnum {
  Google = 'Google',
  Bing = 'Bing',
}

export class SearchService {
  readonly minQueryLength = 3;
  readonly maxQueryHistory = 6;
  private readonly cacheIdx = 'search-query-history';
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 * 30; // 30d
  private readonly searchUrls: Record<SearchEngineEnum, string> = {
    Google: 'https://www.google.com/search?q=',
    Bing: 'https://www.bing.com/search?q=',
  };

  constructor(private readonly Cache: CacheApi) {}

  getQueryHistory(): string[] {
    const cached = this.Cache.getData<string[]>(this.cacheIdx);
    return cached ? cached : [];
  }

  getSimilarQueries(input: string): string[] {
    const history = this.getQueryHistory();
    const words = input.split(' ');

    if (!history.length) {
      return [];
    }

    return matchByWords(words, history, true);
  }

  getSearchUrl(engine: SearchEngineEnum): string {
    if (!this.searchUrls[engine]) {
      throw new Error(`Unsupported search url for ${engine} search engine`);
    }
    return this.searchUrls[engine];
  }

  saveQuery(query: string) {
    const queries = this.getQueryHistory();
    if (
      queries.indexOf(query) === -1 &&
      query.split(' ').filter((v) => v.length > 3).length > 1
    ) {
      if (queries.length >= this.maxQueryHistory) {
        queries.shift();
      }
      queries.push(query);
    }
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(queries),
      expire: Date.now() + this.cacheTimeout,
    });
  }

  delQuery(query: string) {
    const queries = this.getQueryHistory();
    const filtered = [...queries].filter((q) => q !== query);
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(filtered),
      expire: Date.now() + this.cacheTimeout,
    });
  }
}
