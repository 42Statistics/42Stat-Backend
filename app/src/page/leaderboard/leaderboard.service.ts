import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { Time } from 'src/util';

@Injectable()
export class LeaderboardService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private cursusUserService: CursusUserService,
  ) {}

  async expIncrementRank(start: Date, end: Date): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 8500,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 7800,
      },
      {
        userPreview: {
          id: 3,
          login: 'seunpark',
          imgUrl:
            'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
        },
        value: 7250,
      },
      {
        userPreview: {
          id: 4,
          login: 'jayoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/11edf4a6fddf61d0cb5588cb9cdb2a08/jayoon.jpg',
        },
        value: 7180,
      },
      {
        userPreview: {
          id: 5,
          login: 'seseo',
          imgUrl:
            'https://cdn.intra.42.fr/users/0936cfb132fd89dfb0aa4c99aca584b7/seseo.jpg',
        },
        value: 7011,
      },
    ];
  }

  async scoreRank(start: Date, end: Date): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 220,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 208,
      },
      {
        userPreview: {
          id: 3,
          login: 'hyko',
          imgUrl:
            'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
        },
        value: 196,
      },
      {
        userPreview: {
          id: 4,
          login: 'mikim3',
          imgUrl:
            'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
        },
        value: 180,
      },
      {
        userPreview: {
          id: 5,
          login: 'junmoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
        },
        value: 179,
      },
    ];
  }

  async totalScoreRank(): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 220,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 208,
      },
      {
        userPreview: {
          id: 3,
          login: 'hyko',
          imgUrl:
            'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
        },
        value: 196,
      },
      {
        userPreview: {
          id: 4,
          login: 'mikim3',
          imgUrl:
            'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
        },
        value: 180,
      },
      {
        userPreview: {
          id: 5,
          login: 'junmoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
        },
        value: 179,
      },
    ];
  }

  async totalEvalCountRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.getEvalCountRank();
  }

  async evalCountRank(start: Date, end: Date): Promise<UserRankingDateRanged> {
    //todo: start, end 사용하기
    const curr = Time.curr();
    const currMonth = Time.startOfMonth(curr);
    const nextMonth = Time.moveMonth(currMonth, 1);

    const evalCountRank = await this.scaleTeamService.getEvalCountRank({
      beginAt: { $gte: currMonth, $lt: nextMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(
      evalCountRank,
      currMonth,
      Time.moveDate(nextMonth, -1),
    );
  }

  async levelRank(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.getRank('level', limit);
  }
}
