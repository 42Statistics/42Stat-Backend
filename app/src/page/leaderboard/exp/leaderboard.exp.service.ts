import { Injectable } from '@nestjs/common';
import {
  ExperienceUserCacheService,
  type ExpIncreamentRankingCacheSupportedDateTemplate,
} from 'src/api/experienceUser/experienceUser.cache.service';
import { assertExist } from 'src/common/assertExist';
import type { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateArgs,
} from '../util/leaderboard.util.service';

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
  }: RankingByDateTemplateArgs<ExpIncreamentRankingCacheSupportedDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.experienceUserCacheService.getExpIncreamentRank(
      dateTemplate,
      userId,
    );

    const ranking =
      await this.experienceUserCacheService.getExpIncreamentRanking(
        dateTemplate,
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
