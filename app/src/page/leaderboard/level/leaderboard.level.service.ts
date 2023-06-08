import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private cursusUserService: CursusUserService,
  ) {}

  async rank(
    userId: number,
    limit: number,
    paginationIndexArgs: PaginationIndexArgs,
    filter?: FilterQuery<cursus_user>,
  ): Promise<LeaderboardElement> {
    const levelRanking = await this.cursusUserService.rank(
      'level',
      limit,
      filter,
    );

    const me = this.leaderboardUtilService.findUser(levelRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      levelRanking,
      paginationIndexArgs,
    );
  }
}
