import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { UserRanking } from 'src/common/models/common.user.model';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import { LeaderboardService } from '../leaderboard.service';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';

@Injectable()
export class LeaderboardScoreService {
  tempScores = [
    {
      userPreview: {
        id: 1,
        login: 'jaham',
        imgUrl:
          'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
      },
      value: 220,
      rank: 1,
    },
    {
      userPreview: {
        id: 2,
        login: 'yeju',
        imgUrl:
          'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
      },
      value: 208,
      rank: 2,
    },
    {
      userPreview: {
        id: 3,
        login: 'hyko',
        imgUrl:
          'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
      },
      value: 196,
      rank: 3,
    },
    {
      userPreview: {
        id: 4,
        login: 'mikim3',
        imgUrl:
          'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
      },
      value: 180,
      rank: 4,
    },
    {
      userPreview: {
        id: 5,
        login: 'junmoon',
        imgUrl:
          'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
      },
      value: 179,
      rank: 5,
    },
  ];

  constructor(private leaderboardService: LeaderboardService) {}

  async scoreRank(
    userId: number,
    filter?: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const userRanking: UserRanking[] = this.tempScores;

    return this.leaderboardService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }

  async scoreRankByDateRange(
    userId: number,
    { start, end }: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<unknown> = {
      $match: {
        createdAt: { $gte: start, $lt: end },
      },
    };

    const scoreRanking = await this.scoreRank(userId, dateFilter);

    return generateDateRanged(scoreRanking, start, end);
  }

  async scoreRankByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return this.scoreRankByDateRange(userId, dateRange);
  }
}
