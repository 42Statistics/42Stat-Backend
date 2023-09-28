import { Injectable } from '@nestjs/common';
import {
  ExperienceUserCacheService,
  type ExpIncreamentRankingCacheSupportedDateTemplate,
} from 'src/api/experienceUser/experienceUser.cache.service';
import { assertExist } from 'src/common/assertExist';
import type { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardExpService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly experienceUserCacheService: ExperienceUserCacheService,
  ) {}

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
    promo,
  }: RankingByDateTemplateArgs<ExpIncreamentRankingCacheSupportedDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.experienceUserCacheService.getExpIncreamentRank(
      dateTemplate,
      userId,
      promo,
    );

    const ranking =
      await this.experienceUserCacheService.getExpIncreamentRanking(
        dateTemplate,
        promo,
      );

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs,
      dateTemplate,
    });
  }
}
