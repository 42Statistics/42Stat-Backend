import { Module } from '@nestjs/common';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [],
  providers: [LeaderboardExpResolver, LeaderboardExpService],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
