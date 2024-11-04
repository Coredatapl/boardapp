import { CacheApi } from '../../../utils/cache/CacheApi';
import { TodoItemData } from './TodoWidget';

export class TodoService {
  readonly nameMinLength = 3;
  readonly nameMaxLength = 30;
  private readonly cacheIdx = 'todo-list';
  private readonly cacheTimeout = 1000 * 60 * 60 * 24 * 30; // 30d

  constructor(private readonly Cache: CacheApi) {}

  load(): TodoItemData[] | null {
    return this.Cache.getData<TodoItemData[]>(this.cacheIdx);
  }

  update(items: TodoItemData[]) {
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(items),
      expire: Date.now() + this.cacheTimeout,
    });
  }
}
