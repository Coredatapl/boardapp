import { CacheApi } from '../../../utils/cache/CacheApi';
import { ShortcutData } from './ShortcutsWidget';

export class ShortcutsService {
  private readonly cacheIdx = 'shortcut-list';
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 * 30; // 30d

  constructor(private readonly Cache: CacheApi) {}

  get(name: string): ShortcutData | null {
    const cached = this.Cache.getData<ShortcutData[]>(this.cacheIdx);
    return cached
      ? (cached.find((v) => v.name === name) as ShortcutData)
      : null;
  }

  load(): ShortcutData[] | null {
    return this.Cache.getData<ShortcutData[]>(this.cacheIdx);
  }

  update(shortcuts: ShortcutData[]) {
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(shortcuts),
      expire: Date.now() + this.cacheTimeout,
    });
  }
}
