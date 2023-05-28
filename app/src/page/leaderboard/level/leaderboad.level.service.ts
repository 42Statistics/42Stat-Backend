import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LeaderboardService } from '../leaderboard.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private cursusUserService: CursusUserService,
    private leaderboardService: LeaderboardService,
  ) {}

  async levelRank(userId: number, limit: number) {
    const userRanking = await this.cursusUserService.getRank('level', limit);

    return this.leaderboardService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }
}
