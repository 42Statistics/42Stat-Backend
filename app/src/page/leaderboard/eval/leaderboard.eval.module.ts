import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { CacheModule } from 'src/cache/cache.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardEvalResolver } from './leaderboard.eval.resolver';
import { LeaderboardEvalService } from './leaderboard.eval.service';

@Module({
  imports: [
    LeaderboardUtilModule,
    ScaleTeamModule,
    DateRangeModule,
    CacheModule,
  ],
  providers: [LeaderboardEvalResolver, LeaderboardEvalService],
})
// eslint-disable-next-line
export class LeaderboardEvalModule {}
