import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private cursusUserService: CursusUserService,
    private leaderboardUtilService: LeaderboardUtilService,
  ) {}

  async rank(userId: number, limit: number) {
    const userRanking = await this.cursusUserService.rank('level', limit);

    return this.leaderboardUtilService.userRankingToLeaderboardElement(
      userId,
      userRanking,
    );
  }
}
