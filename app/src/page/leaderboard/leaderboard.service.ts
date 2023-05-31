import { Injectable } from '@nestjs/common';
import type { UserRanking } from 'src/common/models/common.user.model';
import type { LeaderboardElement } from './models/leaderboard.model';

@Injectable()
export class LeaderboardService {
  userRankingToLeaderboardElement(
    userId: number,
    userRanking: UserRanking[],
  ): LeaderboardElement {
    return {
      me: userRanking.find(({ userPreview }) => userPreview.id === userId),
      totalRanks: userRanking,
    };
  }
}
