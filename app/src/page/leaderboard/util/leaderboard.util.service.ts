import { Injectable } from '@nestjs/common';
import type {
  LeaderboardElement,
  LeaderboardRanking,
} from '../models/leaderboard.model';

@Injectable()
export class LeaderboardUtilService {
  leaderboardRankingToLeaderboardElement(
    userId: number,
    leaderboardRanking: LeaderboardRanking[],
  ): LeaderboardElement {
    return {
      me: leaderboardRanking.find(
        ({ userPreview }) => userPreview.id === userId,
      ),
      totalRanks: leaderboardRanking,
    };
  }
}
