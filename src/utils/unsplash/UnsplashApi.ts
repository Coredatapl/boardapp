import { CacheApi } from '../cache/CacheApi';
import { ConfigKey, ConfigService } from '../ConfigService';
import FetchApi from '../fetch/FetchApi';

export class UnsplashApi {
  private readonly apiSourceUrl = 'https://source.unsplash.com';
  private readonly apiImageUrl = 'https://images.unsplash.com';
  private readonly cacheIdx = 'background-photo-idx';
  private readonly cacheTimeout = 1000 * 60 * 30; // 30m
  private readonly Cache = new CacheApi();
  private readonly FetchApi = new FetchApi();
  private readonly Config = ConfigService.getInstance();

  async getRandomFromCollection(collectionId?: string): Promise<string> {
    const id = collectionId ? collectionId : 'dPrbbsYeca0';
    const response = (await this.FetchApi.fetch(
      `${this.apiSourceUrl}/collection/${id}/1920x1080`,
      { method: 'GET' }
    )) as Response;
    if (!response.ok) {
      console.error('UnsplashApi get from collection error', response);
    }
    return response.url;
  }

  getRandom(fromCache = false): string {
    const defaultBg = '1519709063170-124e1d4a8e24';
    const collection = [
      defaultBg,
      '1482192596544-9eb780fc7f66',
      '1542312367592-ad151752c038',
      '1497510323977-6a864dd30d6e',
      //'1479030160180-b1860951d696',
      //'1495580847032-db0bac41d44b',
      '1519709063170-124e1d4a8e24',
      '1553564934-07eb77e5b21b',
      '1556760225-5a1e288c573f',
      '1532585731316-84a8f755f53a',
    ];
    const dims = this.getDims();
    let idx: number = 0;

    if (fromCache) {
      const cacheItem = this.Cache.get(this.cacheIdx);
      if (cacheItem) {
        idx = cacheItem.value as unknown as number;
      }
    } else {
      idx = Math.floor(Math.random() * collection.length);
      this.Cache.set(this.cacheIdx, {
        value: `${idx}`,
        expire: Date.now() + this.cacheTimeout,
      });
    }
    if (this.Config.get(ConfigKey.localBg)) {
      return `/img/backgrounds/photo-${collection[idx]}.jpg`;
    }
    return `${this.apiImageUrl}/photo-${collection[idx]}?${dims}`;
  }

  private getDims(): string {
    if (this.Config.get(ConfigKey.mobile)) {
      return `h=${window.innerHeight}&fit=crop&q=70`;
    }
    return `w=${window.innerWidth}&q=90`;
  }
}
