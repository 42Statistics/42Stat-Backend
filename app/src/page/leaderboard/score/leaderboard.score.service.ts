import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { ScoreService } from 'src/api/score/score.service';
import { findUserRank } from 'src/common/findUserRank';
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
export class LeaderboardScoreService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scoreService: ScoreService,
    private dateRangeService: DateRangeService,
  ) {}

  async ranking(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    filter?: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const scoreRanking = await this.scoreService.scoreRank(filter);

    const me = findUserRank(scoreRanking, userId);
    const totalRanks = scoreRanking.filter(({ value }) => value >= 0);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      totalRanks,
      paginationIndexArgs,
    );
  }

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<unknown> = {
      $match: {
        createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      },
    };

    const scoreRanking = await this.ranking(
      userId,
      paginationIndexArgs,
      dateFilter,
    );

    return this.dateRangeService.toDateRanged(scoreRanking, dateRange);
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
