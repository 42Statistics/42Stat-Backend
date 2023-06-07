import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  DateRangeArgs,
  DateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
  LeaderboardRanking,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

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

  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private dateRangeService: DateRangeService,
  ) {}

  async rank(
    userId: number,
    paginationArgs: PaginationIndexArgs,
    filter?: FilterQuery<unknown>,
  ): Promise<LeaderboardElement> {
    const leaderboardRanking: LeaderboardRanking[] = this.tempScores;
    //todo: 블랙홀유저의 value가 0으로 나오는지 확인 후 구분하기

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
