import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { RedisModule, RedisProvider } from 'src/redis/redis.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardEvalCacheService } from './leaderboard.eval.cache.service';
import { LeaderboardEvalResolver } from './leaderboard.eval.resolver';
import { LeaderboardEvalService } from './leaderboard.eval.service';

@Module({
  imports: [
    LeaderboardUtilModule,
    ScaleTeamModule,
    DateRangeModule,
    RedisModule,
  ],
  providers: [
    LeaderboardEvalResolver,
    LeaderboardEvalService,
    LeaderboardEvalCacheService,
    LeaderboardUtilService,
    DateRangeService,
    ScaleTeamService,
    RedisProvider,
    RedisUtilService,
  ],
})
// eslint-disable-next-line
export class LeaderboardEvalModule {}
