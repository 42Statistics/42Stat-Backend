import { Injectable } from '@nestjs/common';
import type { UserRanking } from 'src/common/models/common.user.model';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type { LeaderboardElement } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardUtilService {
  constructor(private paginationIndexService: PaginationIndexService) {}

  findUser(ranking: UserRanking[], userId: number): UserRanking | undefined {
    return ranking.find(({ userPreview }) => userPreview.id === userId);
  }

  toLeaderboardElement(
    me: UserRanking | undefined,
    totalRanks: UserRanking[],
    paginationIndexArgs: PaginationIndexArgs,
  ): LeaderboardElement {
    return {
      me,
      totalRanks: this.paginationIndexService.toPaginated(
        totalRanks,
        paginationIndexArgs,
      ),
    };
  }
}
