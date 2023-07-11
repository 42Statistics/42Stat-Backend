import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardEvalResolver } from './leaderboard.eval.resolver';
import { LeaderboardEvalService } from './leaderboard.eval.service';

@Module({
  imports: [LeaderboardUtilModule, ScaleTeamModule],
  providers: [LeaderboardEvalResolver, LeaderboardEvalService],
})
// eslint-disable-next-line
export class LeaderboardEvalModule {}
