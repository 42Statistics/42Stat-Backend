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

  async rankingByDateTemplate(
    rankingArgs: RankingByDateTemplateArgs<ExpIncreamentRankingCacheSupportedDateTemplate>,
  ): Promise<LeaderboardElementDateRanged> {
    const rank = await this.experienceUserCacheService.getExpIncreamentRank(
      rankingArgs,
    );

    const ranking =
      await this.experienceUserCacheService.getExpIncreamentRanking(
        rankingArgs,
      );

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs: rankingArgs.paginationIndexArgs,
      dateTemplate: rankingArgs.dateTemplate,
    });
  }
}
