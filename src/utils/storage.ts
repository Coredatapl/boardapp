import { LoggerFactory } from "./logger";

type StorageKey =
  | "account"
  | "settings"
  | "shortcuts"
  | "todo"
  | "notifications"
  | "notifications-send"
  | "weather"
  | "location";

interface StorageItem {
  value: string;
  expire: number | undefined;
}

interface StorageInterface {
  check(key: StorageKey): StorageItem | null;
  validate(key: StorageKey, item: StorageItem): StorageItem | null;
  get<T>(key: StorageKey, cb?: () => void): T | null;
  set(key: StorageKey, value: any, expire?: number): void;
  del(key: StorageKey): void;
}

const logger = LoggerFactory("LocalStorage");
const prefix = "ba-";
const defaultExpire = 30 * 24 * 60 * 60 * 1000;

const LocalStorage: StorageInterface = {
  check(key: StorageKey): StorageItem | null {
    const data = localStorage.getItem(`${prefix}${key}`);

    if (!data) {
      return null;
    }

    const item: StorageItem = JSON.parse(data);

    return this.validate(key, item);
  },

  validate(key: StorageKey, item: StorageItem): StorageItem | null {
    if (item.expire && item.expire <= Date.now()) {
      this.del(key);
      return null;
    }
    return item;
  },

  get<T>(key: StorageKey): T | null {
    const cached = this.check(key);
    return cached ? (JSON.parse(cached.value) as T) : null;
  },

  set(key: StorageKey, value: any, expire?: number) {
    const item = {
      value: JSON.stringify(value),
      expire: Date.now() + (expire ?? defaultExpire),
    };
    const itemKey = `${prefix}${key}`;
    const data = JSON.stringify(item);
    localStorage.setItem(itemKey, data);

    logger.log(`${key} data`, "stored");
  },

  del(key: StorageKey): void {
    const itemKey = `${prefix}${key}`;
    localStorage.removeItem(itemKey);
  },
};

export type { StorageInterface, StorageItem, StorageKey };
export { LocalStorage };
