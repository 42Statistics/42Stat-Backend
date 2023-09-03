import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { promo } from 'src/api/cursusUser/db/cursusUser.database.query';
import { assertExist } from 'src/common/assertExist';
import type {
  UserPreview,
  UserRank,
  UserRankWithPromo,
} from 'src/common/models/common.user.model';
import {
  toUserPreviewFromFullProfile,
  type UserFullProfile,
} from 'src/common/userFullProfile';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { CacheUtilService, type CacheWithDate } from './cache.util.service';

export type RankingSupportedDateTemplate = Exclude<
  DateTemplate,
  DateTemplate.LAST_WEEK
>;

export type RankCache = UserFullProfile & UserRankWithPromo;

export type UserFullProfileMap = Map<UserPreview['id'], UserFullProfile>;
export type RankingCacheMap = Map<UserPreview['id'], RankCache>;

export type GetRankingArgs = {
  keyBase: string;
  dateTemplate: RankingSupportedDateTemplate;
};

export type GetRankArgs = GetRankingArgs & { userId: number };

type QueryRankingByDateRangeFn = (dateRange: DateRange) => Promise<UserRank[]>;

@Injectable()
export class CacheUtilRankingService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly cacheUtilService: CacheUtilService,
    private readonly dateRangeService: DateRangeService,
  ) {}

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
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[dateTemplate],
    );

    return await this.cacheUtilService.getMapValue(key, userId);
  }

  async getRawRanking({
    keyBase,
    dateTemplate,
  }: GetRankingArgs): Promise<RankCache[] | undefined> {
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[dateTemplate],
    );

    const rankingCache = await this.cacheUtilService
      .getMapValues<RankCache>(key)
      .then((ranking) => ranking?.sort((a, b) => a.rank - b.rank));

    if (!rankingCache) {
      return undefined;
    }

    return rankingCache;
  }

  async updateCursusUserRanking({
    userFullProfiles,
    keyBase,
    updatedAt,
    valueExtractor,
    userFilter,
  }: {
    userFullProfiles: UserFullProfile[];
    keyBase: string;
    updatedAt: Date;
    valueExtractor: (userFullProfile: UserFullProfile) => number;
    userFilter?: (userFullProfile: UserFullProfile) => boolean;
  }): Promise<void> {
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[DateTemplate.TOTAL],
    );

    const rankingMap: RankingCacheMap = new Map();

    userFullProfiles.forEach((userFullProfile) => {
      if (userFilter && userFilter(userFullProfile)) {
        return;
      }

      rankingMap.set(userFullProfile.cursusUser.user.id, {
        ...userFullProfile,
        userPreview: toUserPreviewFromFullProfile(userFullProfile),
        value: valueExtractor(userFullProfile),
        rank: -1,
        promo: promo(userFullProfile.cursusUser.beginAt),
      });
    });

    fixRanking(rankingMap);

    await this.cacheUtilService.setWithDate(key, rankingMap, updatedAt);
  }

  async setRanking<T extends UserRank>(
    ranking: T[],
    updatedAt: Date,
    keyBase: string,
    dateTemplate: DateTemplate,
  ) {
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[dateTemplate],
    );

    const userFullProfileMap =
      await this.cacheUtilService.getUserFullProfileMap();

    assertExist(userFullProfileMap);

    const res = ranking.reduce((acc, curr) => {
      const userFullProfile = userFullProfileMap.get(curr.userPreview.id)!;
      acc.set(curr.userPreview.id, {
        ...userFullProfile,
        ...curr,
        promo: promo(userFullProfile.cursusUser.beginAt),
      });

      return acc;
    }, new Map() as RankingCacheMap);

    await this.cacheUtilService.setWithDate(key, res, updatedAt);
  }

  async updateRanking({
    userFullProfiles,
    keyBase,
    newUpdatedAt,
    dateTemplate,
    queryRankingFn,
    sortFn,
  }: {
    userFullProfiles: UserFullProfile[];
    keyBase: string;
    newUpdatedAt: Date;
    dateTemplate: RankingSupportedDateTemplate;
    queryRankingFn: QueryRankingByDateRangeFn;
    sortFn?: Parameters<RankCache[]['sort']>[0];
  }): Promise<void> {
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[dateTemplate],
    );

    const newRankingCacheMap = generateEmptyRankingCacheMap(userFullProfiles);
    const updatedRanking = await this.generateUpdatedRanking(
      key,
      newUpdatedAt,
      dateTemplate,
      queryRankingFn,
    );

    this.mergeRankingCacheToMap(newRankingCacheMap, updatedRanking, sortFn);

    await this.cacheUtilService.setWithDate(
      key,
      newRankingCacheMap,
      newUpdatedAt,
    );
  }

  private async generateUpdatedRanking(
    key: string,
    newUpdatedAt: Date,
    dateTemplate: RankingSupportedDateTemplate,
    queryRankingFn: QueryRankingByDateRangeFn,
  ): Promise<UserRank[]> {
    const cached = await this.cacheManager.get<CacheWithDate<RankingCacheMap>>(
      key,
    );

    if (cached && isUpToDate(cached.updatedAt, newUpdatedAt, dateTemplate)) {
      return [...cached.data.values()];
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    if (cached && isReusable(cached.updatedAt, dateTemplate)) {
      dateRange.start = cached.updatedAt;

      const newUserRanking = await queryRankingFn(dateRange);
      this.mergeRankingCacheToMap(cached.data, newUserRanking);

      return [...cached.data.values()];
    }

    return await queryRankingFn(dateRange);
  }

  private mergeRankingCacheToMap(
    rankingCacheMap: RankingCacheMap,
    userRanking: UserRank[],
    sortFn?: Parameters<RankCache[]['sort']>[0],
  ): void {
    userRanking.forEach((userRank) => {
      const prev = rankingCacheMap.get(userRank.userPreview.id);
      assertExist(prev);

      prev.value += userRank.value;
    });

    fixRanking(rankingCacheMap, sortFn);
  }
}

const isReusable = (
  cacheUpdatedAt: Date,
  dateTemplate: RankingSupportedDateTemplate,
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
  dateTemplate: RankingSupportedDateTemplate,
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

const generateEmptyRankingCacheMap = (
  userFullProfiles: UserFullProfile[],
): RankingCacheMap => {
  return userFullProfiles.reduce((map, userFullProfile) => {
    map.set(userFullProfile.cursusUser.user.id, generateRank(userFullProfile));

    return map;
  }, new Map() as RankingCacheMap);
};

const generateRank = (
  userFullProfile: UserFullProfile,
  value?: number,
  rank?: number,
): RankCache => ({
  ...userFullProfile,
  userPreview: toUserPreviewFromFullProfile(userFullProfile),
  rank: rank ?? 0,
  value: value ?? 0,
  promo: promo(userFullProfile.cursusUser.beginAt),
});

const fixRanking = (
  rankingCacheMap: RankingCacheMap,
  sortFn: Parameters<RankCache[]['sort']>[0] = (a, b) => b.value - a.value,
): void => {
  [...rankingCacheMap.values()].sort(sortFn).reduce(
    ({ prevRank, prevValue }, userRank, index) => {
      userRank.rank = prevValue === userRank.value ? prevRank : index + 1;

      return { prevRank: userRank.rank, prevValue: userRank.value };
    },
    { prevRank: 0, prevValue: Number.MIN_SAFE_INTEGER },
  );
};
