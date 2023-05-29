import { Module } from '@nestjs/common';
import { LeaderboardEvalModule } from './eval/leaderboard.eval.module';
import { LeaderboardExpModule } from './exp/leaderboard.exp.module';
import { LeaderboardLevelModule } from './level/leaderboard.level.module';
import { LeaderboardScoreModule } from './score/leaderboard.score.module';

@Module({
  imports: [
    LeaderboardLevelModule,
    LeaderboardExpModule,
    LeaderboardEvalModule,
    LeaderboardScoreModule,
  ],
})
export class LeaderboardModule {}
