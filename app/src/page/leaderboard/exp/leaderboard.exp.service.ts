import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
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
  constructor(private leaderboardService: LeaderboardService) {}

  async expIncrementRank(
    userId: number,
    filter: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const userRanking = tempResult;

    return this.leaderboardService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }

  async expIncrementRankByDateRange(
    userId: number,
    { start, end }: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<unknown> = {
      beginAt: { $gte: start, $lt: end },
      filledAt: { $ne: null },
    };

    const evalCountRank = await this.expIncrementRank(userId, dateFilter);

    return generateDateRanged(evalCountRank, start, end);
  }

  async expIncrementRankByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange =
      this.leaderboardService.dateRangeFromTemplate(dateTemplate);

    return await this.expIncrementRankByDateRange(userId, dateRange);
  }
}
