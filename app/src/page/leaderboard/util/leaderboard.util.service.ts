import { Injectable } from '@nestjs/common';
import type { UserRank } from 'src/common/models/common.user.model';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type { LeaderboardElement } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardUtilService {
  constructor(private paginationIndexService: PaginationIndexService) {}

  toLeaderboardElement(
    me: UserRank | undefined,
    totalRanking: UserRank[],
    paginationIndexArgs: PaginationIndexArgs,
  ): LeaderboardElement {
    return {
      me,
      totalRanking: this.paginationIndexService.toPaginated(
        totalRanking,
        paginationIndexArgs,
      ),
    };
  }
}
