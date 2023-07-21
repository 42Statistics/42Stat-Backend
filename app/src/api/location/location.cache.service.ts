import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
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
    return await this.cacheUtilService.getRank({
      keyBase: LOGTIME_RANKING,
      userId,
      dateTemplate,
    });
  }

  async getLogtimeRanking(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase: LOGTIME_RANKING,
      dateTemplate,
    });
  }

  async getLogtimeRankingMap(
    dateTemplate: LogtimeRankingCacheSupportedDateTemplate,
  ) {
    return await this.cacheUtilService.getRankingMap({
      keyBase: LOGTIME_RANKING,
      dateTemplate,
    });
  }
}
