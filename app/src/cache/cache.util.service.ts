import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { UserFullProfile } from 'src/api/cursusUser/db/cursusUser.database.aggregate';
import { assertExist } from 'src/common/assertExist';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';

const USER_FULL_PROFILE = 'userFullProfile';

export type CacheWithDate<T> = {
  data: T;
  updatedAt: Date;
};

export type CacheSupportedDateTemplate = Exclude<
  DateTemplate,
  DateTemplate.LAST_WEEK | DateTemplate.LAST_YEAR
>;

export type RankCache = UserFullProfile & UserRank;

export type UserFullProfileMap = Map<UserPreview['id'], UserFullProfile>;
export type RankingCacheMap = Map<UserPreview['id'], RankCache>;

export type GetRankingArgs = {
  keyBase: string;
  dateTemplate: CacheSupportedDateTemplate;
};

export type GetRankArgs = GetRankingArgs & { userId: number };

type QueryRankingFn = (dateRange: DateRange) => Promise<UserRank[]>;

@Injectable()
export class CacheUtilService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private dateRangeService: DateRangeService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async getWithoutDate<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager
      .get<CacheWithDate<T>>(key)
      .then((res) => res?.data);
  }

  async set(key: string, data: unknown): Promise<void> {
    await this.cacheManager.set(key, data);
  }

  async setWithDate<T>(
    key: string,
    data: T,
    updatedAt: Date,
    ttl?: number,
  ): Promise<void> {
    await this.cacheManager.set(
      key,
      { data, updatedAt },
      ttl ?? StatDate.DAY * 15,
    );
  }

  private async getMap<K, V>(key: string): Promise<Map<K, V> | undefined> {
    return await this.getWithoutDate<Map<K, V>>(key);
  }

  private async getMapValue<K, V>(
    key: string,
    elemKey: K,
  ): Promise<V | undefined> {
    return await this.getMap<K, V>(key).then((map) => map?.get(elemKey));
  }

  private async getMapValues<V>(key: string): Promise<V[] | undefined> {
    return await this.getMap<unknown, V>(key).then((map) =>
      map ? [...map.values()] : undefined,
    );
  }

  async getUserFullProfile(
    userId: number,
  ): Promise<UserFullProfile | undefined> {
    return await this.getMapValue<number, UserFullProfile>(
      USER_FULL_PROFILE,
      userId,
    );
  }

  async getUserFullProfiles(): Promise<UserFullProfile[] | undefined> {
    return await this.getMapValues(USER_FULL_PROFILE);
  }

  async getUserFullProfileMap(): Promise<UserFullProfileMap | undefined> {
    return this.getWithoutDate<UserFullProfileMap>(USER_FULL_PROFILE);
  }

  async getRank({
    keyBase,
    userId,
    dateTemplate,
  }: GetRankArgs): Promise<RankCache | undefined> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    return await this.getMapValue(key, userId);
  }

  async getRanking({
    keyBase,
    dateTemplate,
  }: GetRankingArgs): Promise<RankCache[] | undefined> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    return await this.getMapValues<RankCache>(key).then((rankingValues) =>
      rankingValues?.sort((a, b) => a.rank - b.rank),
    );
  }

  async getRankingMap({
    keyBase,
    dateTemplate,
  }: GetRankingArgs): Promise<RankingCacheMap | undefined> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    return await this.getMap(key);
  }

  async setUserFullProfiles(
    userFullProfiles: UserFullProfile[],
    updatedAt: Date,
  ): Promise<void> {
    const userFullProfileMap: UserFullProfileMap = new Map();

    userFullProfiles.map((userFullProfile) => {
      userFullProfileMap.set(
        userFullProfile.cursusUser.user.id,
        userFullProfile,
      );
    });

    await this.setWithDate(USER_FULL_PROFILE, userFullProfileMap, updatedAt);
  }

  private async generateEmptyRanking(): Promise<RankingCacheMap> {
    const userFullProfiles = await this.getUserFullProfiles();

    assertExist(userFullProfiles);

    const emptyMap: RankingCacheMap = new Map();

    userFullProfiles.forEach((userFullProfile) => {
      emptyMap.set(userFullProfile.cursusUser.user.id, {
        ...userFullProfile,
        userPreview: this.extractUserPreviewFromFullProfile(userFullProfile),
        rank: -1,
        value: 0,
      });
    });

    return emptyMap;
  }

  async updateRanking(
    keyBase: string,
    newUpdatedAt: Date,
    dateTemplate: CacheSupportedDateTemplate,
    queryRankingByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
  ): Promise<void> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);
    const cached = await this.cacheManager.get<CacheWithDate<RankingCacheMap>>(
      key,
    );

    const newRanking = await this.queryRanking(
      cached ?? {
        data: await this.generateEmptyRanking(),
        updatedAt: new Date(0),
      },
      newUpdatedAt,
      dateTemplate,
      queryRankingByDateRangeFn,
    );

    await this.setWithDate(key, newRanking, newUpdatedAt);
  }

  private async queryRanking(
    cached: CacheWithDate<RankingCacheMap>,
    newUpdatedAt: Date,
    dateTemplate: CacheSupportedDateTemplate,
    queryRankingByDateRangeFn: QueryRankingFn,
  ): Promise<RankingCacheMap> {
    if (isUpToDate(cached.updatedAt, newUpdatedAt, dateTemplate)) {
      return cached.data;
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    if (isReusable(cached.updatedAt, dateTemplate)) {
      dateRange.start = cached.updatedAt;
    }

    const updated = await queryRankingByDateRangeFn(dateRange);
    const newRanking = await this.mergeRanking(cached.data, updated);

    return newRanking;
  }

  private async mergeRanking(
    cached: RankingCacheMap,
    updatedRanking: UserRank[],
  ): Promise<RankingCacheMap> {
    const newMap = new Map(cached);

    for (const updatedRank of updatedRanking) {
      const cached = newMap.get(updatedRank.userPreview.id);

      if (!cached) {
        const userFullProfile = await this.getUserFullProfile(
          updatedRank.userPreview.id,
        );

        assertExist(userFullProfile);

        newMap.set(updatedRank.userPreview.id, {
          ...userFullProfile,
          ...updatedRank,
        });

        continue;
      }

      cached.value += updatedRank.value;
    }

    this.sortRankingMap(newMap);

    return newMap;
  }

  buildKey(...args: string[]): string {
    return args.join(':');
  }

  sortRankingMap(
    rankingMap: RankingCacheMap,
    sortFn: Parameters<RankCache[]['sort']>[0] = (a, b) => b.value - a.value,
  ): void {
    [...rankingMap.values()].sort(sortFn).reduce(
      ({ prevRank, prevValue }, userRank, index) => {
        userRank.rank = prevValue === userRank.value ? prevRank : index + 1;

        return { prevRank: userRank.rank, prevValue: userRank.value };
      },
      { prevRank: 0, prevValue: Number.MIN_SAFE_INTEGER },
    );
  }

  extractUserPreviewFromFullProfile(
    userFullProfile: UserFullProfile,
  ): UserPreview {
    return {
      id: userFullProfile.cursusUser.user.id,
      login: userFullProfile.cursusUser.user.login,
      imgUrl: userFullProfile.cursusUser.user.image.link,
    };
  }
}

const isReusable = (
  cacheUpdatedAt: Date,
  dateTemplate: CacheSupportedDateTemplate,
): boolean => {
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
      return true;
    case DateTemplate.CURR_WEEK:
      return cacheUpdatedAt.getTime() >= StatDate.currWeek().getTime();
    case DateTemplate.CURR_MONTH:
      return cacheUpdatedAt.getTime() >= StatDate.currMonth().getTime();
    default:
      return false;
  }
};

const isUpToDate = (
  cacheUpdatedAt: Date,
  newUpdatedAt: Date,
  dateTemplate: CacheSupportedDateTemplate,
): boolean => {
  switch (dateTemplate) {
    case DateTemplate.TOTAL:
    case DateTemplate.CURR_WEEK:
    case DateTemplate.CURR_MONTH:
      return cacheUpdatedAt.getTime() === newUpdatedAt.getTime();
    case DateTemplate.LAST_MONTH:
      return cacheUpdatedAt.getTime() === StatDate.lastMonth().getTime();
    default:
      return false;
  }
};
