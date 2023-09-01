import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardCommentResolver } from './leaderboard.comment.resolver';
import { LeaderboardCommentService } from './leaderboard.comment.service';

@Module({
  imports: [LeaderboardUtilModule, ScaleTeamModule],
  providers: [LeaderboardCommentResolver, LeaderboardCommentService],
})
// eslint-disable-next-line
export class LeaderboardCommentModule {}
