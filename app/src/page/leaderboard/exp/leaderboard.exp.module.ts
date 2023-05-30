import { Module } from '@nestjs/common';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';
import { LeaderboardService } from '../leaderboard.service';

@Module({
  imports: [],
  providers: [
    LeaderboardExpResolver,
    LeaderboardExpService,
    LeaderboardService,
  ],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
