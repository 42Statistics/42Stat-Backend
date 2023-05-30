import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { LeaderboardEvalResolver } from './leaderboard.eval.resolver';
import { LeaderboardEvalService } from './leaderboard.eval.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { LeaderboardService } from '../leaderboard.service';

@Module({
  imports: [ScaleTeamModule],
  providers: [
    LeaderboardEvalResolver,
    LeaderboardEvalService,
    LeaderboardService,
    ScaleTeamService,
  ],
})
// eslint-disable-next-line
export class LeaderboardEvalModule {}
