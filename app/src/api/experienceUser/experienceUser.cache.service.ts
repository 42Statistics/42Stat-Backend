import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
  type RankCache,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

export type ExpIncreamentRankingCacheSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export const EXP_INCREAMENT_RANKING = 'expIncRanking';

@Injectable()
export class ExperienceUserCacheService {
  constructor(private readonly cacheUtilService: CacheUtilService) {}

  async getExpIncreamentRank(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
    userId: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilService.getRank({
      keyBase: EXP_INCREAMENT_RANKING,
      dateTemplate,
      userId,
    });
  }

  async getExpIncreamentRanking(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase: EXP_INCREAMENT_RANKING,
      dateTemplate,
    });
  }
}
