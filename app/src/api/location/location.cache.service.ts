import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
  type UserRankCache,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

export type LogtimeRankingCacheSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.LAST_MONTH
>;

export const LOGTIME_RANKING = 'logtimeRanking';

@Injectable()
export class LocationCacheService {
  constructor(private cacheUtilService: CacheUtilService) {}

  async getLogtimeRank(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheUtilService.getRank({
      keyBase: LOGTIME_RANKING,
      userId,
      dateTemplate,
    });
  }

  async getLogtimeRanking(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase: LOGTIME_RANKING,
      dateTemplate,
    });
  }
}
