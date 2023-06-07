import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
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

const tempResult = [
  {
    userPreview: {
      id: 1,
      login: 'jaham',
      imgUrl:
        'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
    },
    value: 8500,
    rank: 1,
  },
  {
    userPreview: {
      id: 2,
      login: 'yeju',
      imgUrl:
        'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
    },
    value: 7800,
    rank: 2,
  },
  {
    userPreview: {
      id: 3,
      login: 'seunpark',
      imgUrl:
        'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
    },
    value: 7250,
    rank: 3,
  },
  {
    userPreview: {
      id: 4,
      login: 'jayoon',
      imgUrl:
        'https://cdn.intra.42.fr/users/11edf4a6fddf61d0cb5588cb9cdb2a08/jayoon.jpg',
    },
    value: 7180,
    rank: 4,
  },
  {
    userPreview: {
      id: 5,
      login: 'seseo',
      imgUrl:
        'https://cdn.intra.42.fr/users/0936cfb132fd89dfb0aa4c99aca584b7/seseo.jpg',
    },
    value: 7011,
    rank: 5,
  },
];

@Injectable()
export class LeaderboardExpService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private dateRangeService: DateRangeService,
  ) {}

  async rank(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    filter: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const leaderboardRanking = tempResult;

    return this.leaderboardUtilService.leaderboardRankingToLeaderboardElement(
      userId,
      leaderboardRanking,
      paginationArgs,
      leaderboardRanking.length,
    );
  }

  async rankByDateRange(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<unknown> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      filledAt: { $ne: null },
    };
    //todo: name
    const evalCountRank = await this.rank(userId, paginationArgs, dateFilter);

    return this.dateRangeService.toDateRanged(evalCountRank, dateRange);
  }

  async rankByDateTemplate(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.rankByDateRange(userId, paginationArgs, dateRange);
  }
}
