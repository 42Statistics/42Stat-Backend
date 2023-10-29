import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly cursusUserCacheService: CursusUserCacheService,
  ) {}

  async rankingByDateTemplate(
    rankingArgs: RankingByDateTemplateArgs<DateTemplate.TOTAL>,
  ): Promise<LeaderboardElementDateRanged> {
    const rank = await this.cursusUserCacheService.getUserRank({
      keyBase: USER_LEVEL_RANKING,
      ...rankingArgs,
    });

    const ranking = await this.cursusUserCacheService.getUserRanking({
      keyBase: USER_LEVEL_RANKING,
      ...rankingArgs,
    });

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs: rankingArgs.paginationIndexArgs,
      dateTemplate: rankingArgs.dateTemplate,
    });
  }
}
