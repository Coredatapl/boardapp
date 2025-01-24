import { CacheApi } from './cache/CacheApi';

export enum ConfigKey {
  appName = 'appName',
  welcomeName = 'welcomeName',
  welcomeNameMinLength = 'welcomeNameMinLength',
  welcomeNameMaxLength = 'welcomeNameMaxLength',
  firstRun = 'firstRun',
  widgetWeatherActive = 'widgetWeatherActive',
  widgetDatetimeActive = 'widgetDatetimeActive',
  widgetShortcutsActive = 'widgetShortcutsActive',
  widgetShortcutsNameMaxLength = 'widgetShortcutsNameMaxLength',
  widgetTodoActive = 'widgetTodoActive',
  widgetLinksActive = 'widgetLinksActive',
  widgetMapActive = 'widgetMapActive',
  mobile = 'mobile',
  geolocationPermitted = 'geolocationPermitted',
  geolocationLat = 'geolocationLat',
  geolocationLon = 'geolocationLon',
  localBg = 'localBg',
  contactEmail = 'contactEmail',
  notificationsActive = 'notificationsActive',
}

export type ConfigValue = string | number | boolean;

export type ConfigData = {
  [key in ConfigKey]: ConfigValue;
};

export class ConfigService {
  private static instance: ConfigService;
  private readonly cacheIdx = 'config';
  private config: ConfigData = {
    appName: 'Board App',
    welcomeName: 'to Board App',
    welcomeNameMinLength: 3,
    welcomeNameMaxLength: 30,
    firstRun: true,
    widgetWeatherActive: true,
    widgetDatetimeActive: true,
    widgetShortcutsActive: true,
    widgetShortcutsNameMaxLength: 8,
    widgetTodoActive: true,
    widgetLinksActive: false,
    widgetMapActive: false,
    mobile: window.innerWidth <= 768,
    geolocationPermitted: false,
    geolocationLat: 0,
    geolocationLon: 0,
    localBg: process.env.REACT_APP_LOCAL_BACKGROUND === 'false' ? false : true,
    contactEmail: '',
    notificationsActive: false,
  };

  constructor(private readonly Cache: CacheApi) {
    this.load();
    this.set(ConfigKey.mobile, window.innerWidth <= 768);
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService(new CacheApi());
    }
    return ConfigService.instance;
  }

  get(key?: ConfigKey): ConfigData | ConfigValue {
    return key ? this.config[key] : this.config;
  }

  getValue<T>(key: ConfigKey): T {
    return this.config[key] as T;
  }

  set(key: ConfigKey, value: ConfigValue): void {
    this.config[key] = value;
    this.save(this.config);
  }

  private load(): void {
    const cacheItem = this.Cache.get(this.cacheIdx);

    if (cacheItem) {
      const config: ConfigData = JSON.parse(cacheItem.value);
      for (const prop in ConfigKey) {
        if (typeof config[prop as ConfigKey] !== 'undefined') {
          this.config[prop as ConfigKey] = config[prop as ConfigKey];
        }
      }
    }
  }

  private save(config: ConfigData): void {
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(config),
      expire: undefined,
    });
  }
}
