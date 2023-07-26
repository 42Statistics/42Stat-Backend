import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { UserFullProfile } from 'src/api/cursusUser/cursusUser.service';
import { assertExist } from 'src/common/assertExist';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/statDate/StatDate';

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

type QueryRankingByDateRangeFn = (dateRange: DateRange) => Promise<UserRank[]>;

@Injectable()
export class CacheUtilService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly dateRangeService: DateRangeService,
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
      ttl ?? DateWrapper.DAY * 15,
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

  async getRank(args: GetRankArgs): Promise<RankCache | undefined> {
    const rankCache = await this.getRawRank(args);
    if (!rankCache) {
      return undefined;
    }

    if (rankCache.value <= 0) {
      return {
        ...rankCache,
        rank: 0,
      };
    }

    return rankCache;
  }

  async getRanking(args: GetRankingArgs): Promise<RankCache[] | undefined> {
    const rankingCache = await this.getRawRanking(args);
    if (!rankingCache) {
      return undefined;
    }

    const sliceIndex = rankingCache.findIndex((rank) => rank.value <= 0);

    return rankingCache.slice(0, sliceIndex !== -1 ? sliceIndex : undefined);
  }

  async getRawRank({
    keyBase,
    userId,
    dateTemplate,
  }: GetRankArgs): Promise<RankCache | undefined> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    return await this.getMapValue(key, userId);
  }

  async getRawRanking({
    keyBase,
    dateTemplate,
  }: GetRankingArgs): Promise<RankCache[] | undefined> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    const rankingCache = await this.getMapValues<RankCache>(key).then(
      (ranking) => ranking?.sort((a, b) => a.rank - b.rank),
    );

    if (!rankingCache) {
      return undefined;
    }

    return rankingCache;
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

  async updateRanking({
    keyBase,
    newUpdatedAt,
    dateTemplate,
    queryRankingFn,
    sortFn,
  }: {
    keyBase: string;
    newUpdatedAt: Date;
    dateTemplate: CacheSupportedDateTemplate;
    queryRankingFn: QueryRankingByDateRangeFn;
    sortFn?: Parameters<RankCache[]['sort']>[0];
  }): Promise<void> {
    const key = this.buildKey(keyBase, DateTemplate[dateTemplate]);

    const updatedRanking = await this.generateUpdatedRanking(
      key,
      newUpdatedAt,
      dateTemplate,
      queryRankingFn,
    );

    this.fixRanking(updatedRanking, sortFn);

    await this.setWithDate(key, updatedRanking, newUpdatedAt);
  }

  private async generateUpdatedRanking(
    key: string,
    newUpdatedAt: Date,
    dateTemplate: CacheSupportedDateTemplate,
    queryRankingFn: QueryRankingByDateRangeFn,
  ): Promise<RankingCacheMap> {
    const cached = await this.cacheManager.get<CacheWithDate<RankingCacheMap>>(
      key,
    );

    if (cached) {
      if (isUpToDate(cached.updatedAt, newUpdatedAt, dateTemplate)) {
        return cached.data;
      }

      if (isReusable(cached.updatedAt, dateTemplate)) {
        const dateRange =
          this.dateRangeService.dateRangeFromTemplate(dateTemplate);

        dateRange.start = cached.updatedAt;

        const newUserRanking = await queryRankingFn(dateRange);
        const newRankingCache = await this.toRankingCache(newUserRanking);

        return this.mergeRankingCacheToMap(cached.data, newRankingCache);
      }
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    const newRanking = await queryRankingFn(dateRange);
    const rankingCache = await this.toRankingCache(newRanking);

    return rankingCache.reduce((rankingCacheMap, rankCache) => {
      rankingCacheMap.set(rankCache.cursusUser.user.id, rankCache);

      return rankingCacheMap;
    }, new Map() as RankingCacheMap);
  }

  private async toRankingCache(userRanking: UserRank[]): Promise<RankCache[]> {
    const userFullProfileMap = await this.getUserFullProfileMap();
    assertExist(userFullProfileMap);

    return userRanking.map((userRank) => {
      const userFullProfile = userFullProfileMap.get(userRank.userPreview.id);
      assertExist(userFullProfile);

      return {
        ...userFullProfile,
        ...userRank,
      };
    });
  }

  private mergeRankingCacheToMap(
    rankingCacheMap: RankingCacheMap,
    rankingCache: RankCache[],
  ): RankingCacheMap {
    rankingCache.forEach((rankCache) => {
      const prev = rankingCacheMap.get(rankCache.cursusUser.user.id);

      if (prev) {
        prev.value += rankCache.value;
        return;
      }

      rankingCacheMap.set(rankCache.cursusUser.user.id, rankCache);
    });

    return rankingCacheMap;
  }

  buildKey(...args: string[]): string {
    return args.join(':');
  }

  fixRanking(
    rankingCacheMap: RankingCacheMap,
    sortFn: Parameters<RankCache[]['sort']>[0] = (a, b) => b.value - a.value,
  ): void {
    [...rankingCacheMap.values()].sort(sortFn).reduce(
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
      return (
        cacheUpdatedAt.getTime() >= DateWrapper.currWeek().toDate().getTime()
      );
    case DateTemplate.CURR_MONTH:
      return (
        cacheUpdatedAt.getTime() >= DateWrapper.currMonth().toDate().getTime()
      );
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
      return (
        cacheUpdatedAt.getTime() === DateWrapper.lastMonth().toDate().getTime()
      );
    default:
      return false;
  }
};
