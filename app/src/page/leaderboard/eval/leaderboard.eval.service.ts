import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import { LeaderboardService } from '../leaderboard.service';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardService: LeaderboardService,
    private scaleTeamService: ScaleTeamService,
  ) {}

  async evalCountRank(
    userId: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<LeaderboardElement> {
    const userRanking = await this.scaleTeamService.getEvalCountRank(filter);

    return this.leaderboardService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }

  async evalCountRankByDateRange(
    userId: number,
    { start, end }: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<scale_team> = {
      beginAt: { $gte: start, $lt: end },
      filledAt: { $ne: null },
    };

    const evalCountRank = await this.evalCountRank(userId, dateFilter);

    return generateDateRanged(evalCountRank, start, end);
  }

  async evalCountRankByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange =
      this.leaderboardService.dateRangeFromTemplate(dateTemplate);

    return this.evalCountRankByDateRange(userId, dateRange);
  }
}
