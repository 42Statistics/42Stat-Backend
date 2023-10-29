import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type GetRankArgs,
  type GetRankingArgs,
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
    cacheArgs: Omit<GetRankArgs, 'keyBase'>,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRank({
      keyBase: EXP_INCREAMENT_RANKING,
      ...cacheArgs,
    });
  }

  async getExpIncreamentRanking(
    cacheArgs: Omit<GetRankingArgs, 'keyBase'>,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRanking({
      keyBase: EXP_INCREAMENT_RANKING,
      ...cacheArgs,
    });
  }
}
