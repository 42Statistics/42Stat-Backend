import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import {
  LeaderboardFloatElement,
  LeaderboardFloatRanking,
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
    filter?: FilterQuery<cursus_user>,
  ): Promise<LeaderboardFloatElement> {
    const leaderboardRanking: LeaderboardFloatRanking[] =
      await this.cursusUserService.rank('level', limit, filter);

    return this.leaderboardUtilService.leaderboardFloatRankingToLeaderboardFloatElement(
      userId,
      leaderboardRanking,
      paginationArgs,
      leaderboardRanking.length,
    );
  }
}
