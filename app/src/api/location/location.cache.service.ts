import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type RankingSupportedDateTemplate,
  type GetRankArgs,
  type GetRankingArgs,
  type RankCache,
} from 'src/cache/cache.util.ranking.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

export type LogtimeRankingCacheSupportedDateTemplate = Extract<
  RankingSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.LAST_MONTH
>;

export const LOGTIME_RANKING = 'logtimeRanking';

@Injectable()
export class LocationCacheService {
  constructor(
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

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
      return await this.cacheUtilRankingService.getRawRank(args);
    }

    return await this.cacheUtilRankingService.getRank(args);
  }

  async getLogtimeRanking(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    const args: GetRankingArgs = {
      keyBase: LOGTIME_RANKING,
      dateTemplate,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilRankingService.getRawRanking(args);
    }

    return await this.cacheUtilRankingService.getRanking(args);
  }
}
