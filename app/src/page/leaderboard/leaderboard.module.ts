import { Module } from '@nestjs/common';
import { LeaderboardCommentModule } from './comment/leaderboard.comment.module';
import { LeaderboardBaseModule } from './common/leaderboard.base.module';
import { LeaderboardEvalModule } from './eval/leaderboard.eval.module';
import { LeaderboardExpModule } from './exp/leaderboard.exp.module';
import { LeaderboardLevelModule } from './level/leaderboard.level.module';
import { LeaderboardScoreModule } from './score/leaderboard.score.module';

@Module({
  imports: [
    LeaderboardBaseModule,
    LeaderboardLevelModule,
    LeaderboardExpModule,
    LeaderboardEvalModule,
    LeaderboardScoreModule,
    LeaderboardCommentModule,
  ],
})
// eslint-disable-next-line
export class LeaderboardModule {}
