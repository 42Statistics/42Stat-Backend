import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { ScoreService } from 'src/api/score/score.service';
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

  async rank(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    filter?: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const scoreRanking = await this.scoreService.scoreRank(filter);

    return this.leaderboardUtilService.leaderboardRankingToLeaderboardElement(
      userId,
      scoreRanking,
      paginationArgs,
      scoreRanking.length,
    );
  }

  async rankByDateRange(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<unknown> = {
      $match: {
        createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      },
    };

    const scoreRanking = await this.rank(userId, paginationArgs, dateFilter);

    return this.dateRangeService.toDateRanged(scoreRanking, dateRange);
  }

  async rankByDateTemplate(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankByDateRange(userId, paginationArgs, dateRange);
  }
}
