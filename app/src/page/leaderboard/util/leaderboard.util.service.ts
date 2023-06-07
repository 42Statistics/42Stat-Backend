import { Injectable } from '@nestjs/common';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type {
  LeaderboardElement,
  LeaderboardRanking,
} from '../models/leaderboard.model';

@Injectable()
export class LeaderboardUtilService {
  constructor(private paginationIndexService: PaginationIndexService) {}

  leaderboardRankingToLeaderboardElement(
    userId: number,
    leaderboardRanking: LeaderboardRanking[],
    paginationArgs: PaginationIndexArgs,
    totalCount: number,
  ): LeaderboardElement {
    return {
      me: leaderboardRanking.find(
        ({ userPreview }) => userPreview.id === userId,
      ),
      totalRanks: this.paginationIndexService.toPaginated(
        leaderboardRanking,
        totalCount,
        paginationArgs,
      ),
    };
  }
}
