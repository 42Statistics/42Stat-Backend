import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
  type GetRankArgs,
  type GetRankingArgs,
  type RankCache,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

export type LogtimeRankingCacheSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.LAST_MONTH
>;

export const LOGTIME_RANKING = 'logtimeRanking';

@Injectable()
export class LocationCacheService {
  constructor(private readonly cacheUtilService: CacheUtilService) {}

  async getLogtimeRank(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
    userId: number,
  ): Promise<RankCache | undefined> {
    const args: GetRankArgs = {
      keyBase: LOGTIME_RANKING,
      userId,
      dateTemplate,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilService.getRawRank(args);
    }

    return await this.cacheUtilService.getRank(args);
  }

  async getLogtimeRanking(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    const args: GetRankingArgs = {
      keyBase: LOGTIME_RANKING,
      dateTemplate,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilService.getRawRanking(args);
    }

    return await this.cacheUtilService.getRanking(args);
  }
}
