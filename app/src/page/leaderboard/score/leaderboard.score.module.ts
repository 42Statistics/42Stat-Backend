import { Module } from '@nestjs/common';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';

@Module({
  imports: [],
  providers: [LeaderboardScoreResolver, LeaderboardScoreService],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
