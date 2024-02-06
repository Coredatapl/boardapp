export interface CacheItem {
  value: string;
  expire: number | undefined;
}

export class CacheApi {
  private readonly prefix = 'boardapp-';

  get(key: string): CacheItem | null {
    const data = localStorage.getItem(`${this.prefix}${key}`);

    if (!data) {
      return null;
    }

    const item: CacheItem = JSON.parse(data);

    return this.validate(key, item);
  }

  getData<T>(idx: string): T | null {
    const cached = this.get(idx);
    return cached ? (JSON.parse(cached.value) as T) : null;
  }

  set(key: string, value: CacheItem): void {
    const data = JSON.stringify(value);
    localStorage.setItem(`${this.prefix}${key}`, data);
  }

  private validate(key: string, item: CacheItem): CacheItem | null {
    if (item.expire && item.expire <= Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return item;
  }
}
