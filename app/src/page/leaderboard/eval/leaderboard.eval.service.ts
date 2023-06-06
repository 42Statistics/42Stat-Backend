import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
  LeaderboardRanking,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scaleTeamService: ScaleTeamService,
    private dateRangeService: DateRangeService,
  ) {}

  async rank(
    userId: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<LeaderboardElement> {
    const leaderboardRanking = (await this.scaleTeamService.evalCountRank(
      filter,
    )) as unknown as LeaderboardRanking[];

    return this.leaderboardUtilService.leaderboardRankingToLeaderboardElement(
      userId,
      leaderboardRanking,
    );
  }

  async rankByDateRange(
    userId: number,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      filledAt: { $ne: null },
    };

    const evalCountRank = await this.rank(userId, dateFilter);

    return this.dateRangeService.toDateRanged(evalCountRank, dateRange);
  }

  async rankByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankByDateRange(userId, dateRange);
  }
}
