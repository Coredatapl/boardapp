import { DateTime } from '../DateTime';
import { CacheApi } from '../cache/CacheApi';

export enum StatsRange {
  global = 'global',
}

export enum StatsType {
  shortcuts = 'shortcuts',
  todo = 'todo',
}

export enum StatsKeyEnum {
  globalShortcuts = 'global.shortcuts',
  globalShortcutsMorning = 'global.shortcuts.morning',
  globalShortcutsAfternoon = 'global.shortcuts.afternoon',
  globalShortcutsEvening = 'global.shortcuts.evening',
  globalTodo = 'global.todo',
}

export type StatsCounter = {
  name: string;
  count: number;
};

export type StatsValue = string | number | StatsCounter[];

export type StatsData = {
  [key in StatsKeyEnum]: StatsValue;
};

export class StatsApi {
  private static instance: StatsApi;
  private statsData: StatsData = {
    [StatsKeyEnum.globalShortcuts]: [],
    [StatsKeyEnum.globalShortcutsMorning]: [],
    [StatsKeyEnum.globalShortcutsAfternoon]: [],
    [StatsKeyEnum.globalShortcutsEvening]: [],
    [StatsKeyEnum.globalTodo]: [],
  };
  private readonly cacheIdx = 'stats';

  private constructor(private readonly Cache: CacheApi) {
    this.load();
  }

  static getInstance(): StatsApi {
    if (!StatsApi.instance) {
      StatsApi.instance = new StatsApi(CacheApi.getInstance());
    }
    return StatsApi.instance;
  }

  get(key: StatsKeyEnum): StatsValue | undefined {
    this.load();
    return this.statsData[key];
  }

  getTopCounter(
    range: StatsRange,
    type: StatsType,
    byDayTime = true
  ): StatsCounter | undefined {
    const key = this.calculateKey(range, type, byDayTime);
    const counters = this.get(key) as StatsCounter[];

    if (!counters || !counters.length) {
      return;
    }

    counters.sort((a, b) =>
      b.count > a.count ? 1 : b.count < a.count ? -1 : 0
    );
    const topCounter = counters[0];

    if (topCounter.count >= 10) {
      return topCounter;
    }
  }

  count(
    range: StatsRange,
    type: StatsType,
    counterName: string,
    byDayTime = true
  ) {
    const key = this.calculateKey(range, type, byDayTime);
    const counters = this.get(key as StatsKeyEnum) as StatsCounter[];
    const counter = counters
      ? counters.find((v) => v.name === counterName)
      : undefined;

    if (counter) {
      counter.count++;
    } else {
      counters.push({
        name: counterName,
        count: 1,
      });
    }

    if (range === StatsRange.global && byDayTime) {
      // always count global stats
      this.count(range, type, counterName, false);
    }

    this.statsData[key as StatsKeyEnum] = counters;
    this.save();
  }

  private save() {
    this.Cache.set(this.cacheIdx, {
      value: JSON.stringify(this.statsData),
      expire: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1Y
    });
  }

  private load(): void {
    const cacheItem = this.Cache.getData<StatsData>(this.cacheIdx);

    if (cacheItem) {
      const keys = Object.values(StatsKeyEnum);
      for (const key of keys) {
        if (cacheItem[key as StatsKeyEnum]) {
          this.statsData[key as StatsKeyEnum] = cacheItem[key as StatsKeyEnum];
        }
      }
    }
  }

  private calculateKey(
    range: StatsRange,
    type: StatsType,
    byDayTime = true
  ): StatsKeyEnum {
    const dayTime = DateTime.getDayTime();
    const key = `${range}.${type}${byDayTime ? '.' + dayTime : ''}`;
    return key as StatsKeyEnum;
  }
}
