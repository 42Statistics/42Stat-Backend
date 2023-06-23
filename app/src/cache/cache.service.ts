import { Injectable } from '@nestjs/common';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CacheInMemoryService } from './inMemory/cache.inMemory.service';

export type CacheSupportedDateTemplate = Extract<
  DateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.LAST_MONTH
>;

export interface StatCacheService {
  get: <T>(key: string) => Promise<T | undefined>;
  hGet: <T>(key: string, field: string) => Promise<T | undefined>;
  hGetAll<T>(key: string): Promise<Map<string, T> | undefined>;
  getRanking: (
    key: string,
    dateTemplate: CacheSupportedDateTemplate,
  ) => Promise<UserRank[] | undefined>;
  set: (key: string, value: unknown) => Promise<void>;
  updateRanking: (
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    queryByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
    initRankingFn: () => Promise<UserPreview[]>,
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

  async getRanking(
    key: string,
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<UserRank[] | undefined> {
    return await this.cacheInMemoryService.getRanking(key, dateTemplate);
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.cacheInMemoryService.set(key, value);
  }

  /**
   *
   * @description
   * cache key 의 생성 날짜를 통해 갱신이 필요한지 확인하고, `UserRank[]` cache 를 갱신하거나 새로 만듭니다.
   * 만료된 cache 는 삭제합니다.
   *
   * @param queryTargetUserPreviewFn
   * 기존에 cache 가 없는 경우, 새로 cache 를 생성하기 위해 필요한, 랭킹에 집계되길 원하는
   * `cursus_user` 들의 `UserPreview` 를 가져오는 함수 입니다.
   */
  async updateRanking(
    keyBase: string,
    dateTemplate: CacheSupportedDateTemplate,
    queryByDateRangeFn: (dateRange: DateRange) => Promise<UserRank[]>,
    queryTargetUserPreviewFn: () => Promise<UserPreview[]>,
  ): Promise<void> {
    await this.cacheInMemoryService.updateRanking(
      keyBase,
      dateTemplate,
      queryByDateRangeFn,
      queryTargetUserPreviewFn,
    );
  }
}
