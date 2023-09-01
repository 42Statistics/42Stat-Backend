import { Injectable } from '@nestjs/common';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import {
  LeaderboardUtilService,
  RankingByDateTemplateArgs,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardCommentService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
  }: RankingByDateTemplateArgs<DateTemplate.TOTAL>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scaleTeamCacheService.getCommentRank(userId);
    const ranking = await this.scaleTeamCacheService.getCommentRanking();

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs,
      dateTemplate,
    });
  }
}
