import { Injectable } from '@nestjs/common';
import type { UserFullProfile } from 'src/api/cursusUser/db/cursusUser.database.aggregate';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CacheInMemoryService } from './inMemory/cache.inMemory.service';

export type CacheSupportedDateTemplate = Exclude<
  DateTemplate,
  DateTemplate.LAST_WEEK | DateTemplate.LAST_YEAR
>;

export type UserRankCache = UserFullProfile & UserRank;

export interface StatCacheService {
  get: <T>(key: string) => Promise<T | undefined>;
  hGet: <T>(key: string, field: string) => Promise<T | undefined>;
  hGetAll<T>(key: string): Promise<Map<string, T> | undefined>;
  getRank: (
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    userId: number,
  ) => Promise<UserRankCache | undefined>;
  getRanking: (
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
  ) => Promise<UserRankCache[] | undefined>;
  set: (key: string, value: unknown) => Promise<void>;
  hSet: (key: string, field: string, value: unknown) => Promise<void>;
  hSetMany: (
    key: string,
    elems: { field: string; value: unknown }[],
  ) => Promise<void>;
  updateRanking: (
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    queryDataByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
    queryTargetUserFullProfileFn: () => Promise<UserFullProfile[]>,
  ) => Promise<void>;
}

@Injectable()
export class CacheService implements StatCacheService {
  constructor(private cacheInMemoryService: CacheInMemoryService) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheInMemoryService.get(key);
  }

  async hGet<T>(key: string, field: string): Promise<T | undefined> {
    return await this.cacheInMemoryService.hGet(key, field);
  }

  async hGetAll<T>(key: string): Promise<Map<string, T> | undefined> {
    return await this.cacheInMemoryService.hGetAll(key);
  }

  async getRank(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheInMemoryService.getRank(
      keyBase,
      dateTemplate,
      userId,
    );
  }

  async getRanking(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheInMemoryService.getRanking(keyBase, dateTemplate);
  }

  /**
   *
   * @description
   * `key` 가 이미 존재하고 있을 경우, `value` 의 값으로 덮어씌워집니다.
   */
  async set(key: string, value: unknown): Promise<void> {
    await this.cacheInMemoryService.set(key, value);
  }

  async hSet(key: string, field: string, value: unknown): Promise<void> {
    await this.cacheInMemoryService.hSet(key, field, value);
  }

  async hSetMany(
    key: string,
    elems: { field: string; value: unknown }[],
  ): Promise<void> {
    await this.cacheInMemoryService.hSetMany(key, elems);
  }

  /**
   *
   * @description
   * cache key 의 생성 날짜를 통해 갱신이 필요한지 확인하고, `UserRankCache[]` 를 갱신하거나 새로 만듭니다.
   * 만료된 cache 는 삭제합니다.
   *
   * @param queryTargetUserFullProfileFn
   * 기존에 cache 가 없는 경우, 새로 cache 를 생성하기 위해 필요한, 랭킹에 집계되길 원하는
   * `cursus_user` 들의 `UserFullProfile` 을 가져오는 함수 입니다.
   */
  async updateRanking(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    queryDataByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
    queryTargetUserFullProfileFn: () => Promise<UserFullProfile[]>,
  ): Promise<void> {
    await this.cacheInMemoryService.updateRanking(
      keyBase,
      dateTemplate,
      queryDataByDateRangeFn,
      queryTargetUserFullProfileFn,
    );
  }

  extractUserRankFromCache({
    cursusUser,
    rank,
    value,
  }: UserRankCache): UserRank {
    return {
      userPreview: {
        id: cursusUser.user.id,
        login: cursusUser.user.login,
        imgUrl: cursusUser.user.image.link,
      },
      rank,
      value,
    };
  }
}
