import { Injectable } from '@nestjs/common';
import { assertExist } from 'src/common/assertExist';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import { partition } from 'src/common/partition';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
  CacheSupportedDateTemplate,
  StatCacheService,
} from '../cache.service';

type KeySelector = (key: string) => boolean;
type RankingCache = Record<string, UserRank>;

// eslint-disable-next-line
const normalStorage = new Map<string, any>();
const rankingStorage = new Map<string, RankingCache>();
// eslint-disable-next-line
const hashStorage = new Map<string, Map<string, any>>();

@Injectable()
export class CacheInMemoryService implements StatCacheService {
  // todo: dev
  listKeys() {
    console.log([...rankingStorage.keys()]);
  }

  get<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(normalStorage.get(key));
  }

  hGet<T>(key: string, field: string): Promise<T | undefined> {
    return Promise.resolve(hashStorage.get(key)?.get(field));
  }

  hGetAll<T>(key: string): Promise<Map<string, T> | undefined> {
    return Promise.resolve(hashStorage.get(key));
  }

  getRanking(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<UserRank[] | undefined> {
    const cacheKey = findKeyByDateTemplate(keyBase, dateTemplate);

    if (!cacheKey) {
      return Promise.resolve(undefined);
    }

    const rankingCache = rankingStorage.get(cacheKey) as
      | RankingCache
      | undefined;
    if (!rankingCache) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(
      Object.values(rankingCache).sort((a, b) => a.rank - b.rank),
    );
  }

  set(key: string, value: unknown): Promise<void> {
    normalStorage.set(key, value);

    return Promise.resolve();
  }

  async updateRanking(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    queryByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
    queryTargetUserPreview: () => Promise<UserPreview[]>,
  ): Promise<void> {
    const lambdaUpdatedAt = await getLambdaUpdatedAt();

    const keySelector = getKeySelectorByDateTempate(dateTemplate);
    const oldKeys = [...rankingStorage.keys()].filter(keySelector);
    const [staleKeys, reusableKeys] = partition(oldKeys, (key) =>
      isStaleKey(key, dateTemplate),
    );

    const reusableKey = reusableKeys.at(0);

    staleKeys.forEach((staleKey) => rankingStorage.delete(staleKey));

    const newKey = buildKeyByDateTemplate(
      keyBase,
      dateTemplate,
      lambdaUpdatedAt,
    );

    if (reusableKey === newKey) {
      return;
    }

    if (!reusableKey) {
      const userPreviews = await queryTargetUserPreview();

      rankingStorage.set(
        newKey,
        userPreviews.reduce((cache, userPreview) => {
          cache[userPreview.id] = {
            userPreview,
            rank: 1,
            value: 0,
          };

          return cache;
        }, {} as RankingCache),
      );
    }

    const cached = rankingStorage.get(reusableKey ?? newKey);
    assertExist(cached);

    const dateRange = getDateRangeByDateTemplateFromKey(
      reusableKey,
      dateTemplate,
      lambdaUpdatedAt,
    );

    const datas = await queryByDateRangeFn(dateRange);

    datas.forEach(({ userPreview, value }) => {
      cached[userPreview.id].value += value;
    });

    Object.values(cached)
      .sort((a, b) => b.value - a.value)
      .forEach((curr, index) => {
        curr.rank = index + 1;
      });

    if (reusableKey !== newKey) {
      rankingStorage.set(newKey, cached);

      if (reusableKey) {
        rankingStorage.delete(reusableKey);
      }
    }
  }
}

const buildKey = (keyBase: string, ...args: string[]) =>
  [keyBase, ...args].join(':');

const buildKeyByDateTemplate = (
  keyBase: string,
  dateTemplate: CacheSupportedDateTemplate,
  dataUpdatedAt: Date,
): string => {
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
    case DateTemplate.CURR_MONTH:
      return buildKey(
        keyBase,
        DateTemplate[dateTemplate],
        dataUpdatedAt.getTime().toString(),
      );
    case DateTemplate.LAST_MONTH:
      return buildKey(
        keyBase,
        DateTemplate[dateTemplate],
        StatDate.lastMonth().getTime().toString(),
      );
  }
};

// todo
const getLambdaUpdatedAt = async () => {
  const date = new StatDate().moveMs(StatDate.MIN * -10);
  date.setSeconds(0, 0);
  return date;
};

const extractKeyBase = (key: string) => key.split(':').at(0);

const extractKeyDateTemplate = (key: string): string | undefined =>
  key.split(':').at(1);

const extractKeyDate = (key: string): Date => {
  const keyTimePartString = key.split(':').at(2);
  if (!keyTimePartString) {
    throw Error('wrong key format: ' + key);
  }

  return new Date(parseInt(keyTimePartString));
};

const isTotalKey: KeySelector = (key): boolean =>
  extractKeyDateTemplate(key) === DateTemplate[DateTemplate.TOTAL];

const isCurrMonthKey: KeySelector = (key): boolean =>
  extractKeyDateTemplate(key) === DateTemplate[DateTemplate.CURR_MONTH];

const isLastMonthKey: KeySelector = (key): boolean =>
  extractKeyDateTemplate(key) === DateTemplate[DateTemplate.LAST_MONTH];

const isStaleKey = (
  key: string,
  dateTemplate: CacheSupportedDateTemplate,
): boolean => {
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
      return false;
    case DateTemplate.CURR_MONTH:
      return extractKeyDate(key).getTime() < StatDate.currMonth().getTime();
    case DateTemplate.LAST_MONTH:
      return extractKeyDate(key).getTime() !== StatDate.lastMonth().getTime();
  }
};

const getKeySelectorByDateTempate = (
  dateTemplate: CacheSupportedDateTemplate,
) => {
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
      return isTotalKey;
    case DateTemplate.CURR_MONTH:
      return isCurrMonthKey;
    case DateTemplate.LAST_MONTH:
      return isLastMonthKey;
  }
};

const getDateRangeByDateTemplateFromKey = (
  key: string | undefined,
  dateTemplate: CacheSupportedDateTemplate,
  dataUpdatedAt: Date,
): DateRange => {
  let start: Date;
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
      start = key ? extractKeyDate(key) : new Date(0);
      break;
    case DateTemplate.CURR_MONTH:
      start = key ? extractKeyDate(key) : StatDate.currMonth();
      break;
    case DateTemplate.LAST_MONTH:
      start = StatDate.lastMonth();
      break;
  }

  const end =
    dateTemplate === DateTemplate.LAST_MONTH
      ? StatDate.currMonth()
      : dataUpdatedAt;

  return { start, end };
};

const findKeyByDateTemplate = (
  keyBase: string,
  dateTemplate: CacheSupportedDateTemplate,
): string | undefined =>
  [...rankingStorage.keys()].find(
    (key) =>
      extractKeyBase(key) === keyBase &&
      extractKeyDateTemplate(key) === DateTemplate[dateTemplate],
  );
