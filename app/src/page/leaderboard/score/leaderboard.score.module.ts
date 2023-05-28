import { Module } from '@nestjs/common';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';
import { LeaderboardService } from '../leaderboard.service';

@Module({
  imports: [],
  providers: [
    LeaderboardScoreResolver,
    LeaderboardScoreService,
    LeaderboardService,
  ],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
