import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardEvalResolver } from './leaderboard.eval.resolver';
import { LeaderboardEvalService } from './leaderboard.eval.service';

@Module({
  imports: [LeaderboardUtilModule, ScaleTeamModule],
  providers: [
    LeaderboardEvalResolver,
    LeaderboardEvalService,
    LeaderboardUtilService,
    ScaleTeamService,
  ],
})
// eslint-disable-next-line
export class LeaderboardEvalModule {}
