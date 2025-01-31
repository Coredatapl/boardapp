import AssistantApi from '../../../utils/assistant/AssistantApi';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { ConfigKey, ConfigService } from '../../../utils/ConfigService';
import { NotificationData } from './NotificationWidget';

export class NotificationService {
  readonly notifyAfterDays = 7;
  private static instance: NotificationService;
  private readonly cacheIdx = 'notifications-list';
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 * 30; // 30d

  private constructor(
    private readonly cacheApi: CacheApi,
    private readonly configService: ConfigService,
    private readonly assistantApi: AssistantApi
  ) {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(
        CacheApi.getInstance(),
        ConfigService.getInstance(),
        AssistantApi.getInstance()
      );
    }

    return NotificationService.instance;
  }

  load(): NotificationData[] | null {
    return this.cacheApi.getData<NotificationData[]>(this.cacheIdx);
  }

  add(item: NotificationData) {
    const list = this.load() || [];
    list.push({ ...item, id: list.length + 1 });
    this.update(list);
  }

  update(items: NotificationData[]) {
    this.cacheApi.set(this.cacheIdx, {
      value: JSON.stringify(items),
      expire: Date.now() + this.cacheTimeout,
    });
  }

  async requestSend(items: NotificationData[]) {
    if (!this.configService.getValue<boolean>(ConfigKey.notificationsActive)) {
      return;
    }
    const email = this.configService.getValue<string>(ConfigKey.contactEmail);
    const message = items.map((i) => i.message).join('<br />');
    return this.assistantApi.sendEmail(email, message);
  }
}
