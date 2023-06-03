import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import { dateRangeFilter } from 'src/dateRange/db/dateRange.database.aggregate';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scaleTeamService: ScaleTeamService,
  ) {}

  async evalCountRank(
    userId: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<LeaderboardElement> {
    const userRanking = await this.scaleTeamService.evalCountRank(filter);

    return this.leaderboardUtilService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }

  async evalCountRankByDateRange(
    userId: number,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<scale_team> = {
      beginAt: dateRangeFilter(dateRange),
      filledAt: { $ne: null },
    };

    const evalCountRank = await this.evalCountRank(userId, dateFilter);

    return generateDateRanged(evalCountRank, dateRange);
  }

  async evalCountRankByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return this.evalCountRankByDateRange(userId, dateRange);
  }
}
