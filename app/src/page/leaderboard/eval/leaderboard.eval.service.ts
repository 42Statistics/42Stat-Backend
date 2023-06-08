import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
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
    private dateRangeService: DateRangeService,
  ) {}

  async ranking(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    filter?: FilterQuery<scale_team>,
  ): Promise<LeaderboardElement> {
    const evalRanking = await this.scaleTeamService.evalCountRanking(filter);

    const me = this.leaderboardUtilService.findUser(evalRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      evalRanking,
      paginationIndexArgs,
    );
  }

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      filledAt: { $ne: null },
    };

    const evalRanking = await this.ranking(
      userId,
      paginationIndexArgs,
      dateFilter,
    );

    return this.dateRangeService.toDateRanged(evalRanking, dateRange);
  }

  async rankingByDateTemplate(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankingByDateRange(userId, paginationIndexArgs, dateRange);
  }
}
