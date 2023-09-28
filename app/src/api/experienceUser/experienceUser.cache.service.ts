import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type RankCache,
  type RankingSupportedDateTemplate,
} from 'src/cache/cache.util.ranking.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

export type ExpIncreamentRankingCacheSupportedDateTemplate = Extract<
  RankingSupportedDateTemplate,
  DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export const EXP_INCREAMENT_RANKING = 'expIncRanking';

@Injectable()
export class ExperienceUserCacheService {
  constructor(
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

  async getExpIncreamentRank(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
    userId: number,
    promo?: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRank({
      keyBase: EXP_INCREAMENT_RANKING,
      dateTemplate,
      userId,
      promo,
    });
  }

  async getExpIncreamentRanking(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
    promo?: number,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRanking({
      keyBase: EXP_INCREAMENT_RANKING,
      dateTemplate,
      promo,
    });
  }
}
