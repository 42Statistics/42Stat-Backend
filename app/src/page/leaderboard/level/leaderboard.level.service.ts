import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import {
  LeaderboardElement,
  LeaderboardRanking,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private cursusUserService: CursusUserService,
    private leaderboardUtilService: LeaderboardUtilService,
  ) {}

  async rank(
    userId: number,
    limit: number,
    paginationArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    const leaderboardRanking: LeaderboardRanking[] =
      await this.cursusUserService.rank('level', limit);

    return this.leaderboardUtilService.leaderboardRankingToLeaderboardElement(
      userId,
      leaderboardRanking,
      paginationArgs,
      leaderboardRanking.length,

      // userId,
      // [
      //   {
      //     userPreview: {
      //       id: 99947,
      //       login: 'jaham',
      //       imgUrl:
      //         'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
      //     },
      //     value: 1,
      //     rank: 1,
      //   },
      //   ...userRanking.map((userRank, index) => ({
      //     rank: index + 1,
      //     ...userRank,
      //   })),
      // ],
    );
  }
}
