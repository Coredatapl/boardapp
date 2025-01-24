import { CacheApi } from '../../../utils/cache/CacheApi';
import { NotificationData } from './NotificationWidget';

export class NotificationService {
  readonly nameMinLength = 3;
  readonly nameMaxLength = 30;
  private readonly cacheIdx = 'notifications-list';
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 * 30; // 30d

  constructor(private readonly Cache: CacheApi) {}

  load(): NotificationData[] | null {
    return this.Cache.getData<NotificationData[]>(this.cacheIdx);
  }

  add(item: NotificationData) {
    const list = this.load() || [];
    list.push({ ...item, id: list.length + 1 });
    this.update(list);
  }

  update(items: NotificationData[]) {
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(items),
      expire: Date.now() + this.cacheTimeout,
    });
  }
}
