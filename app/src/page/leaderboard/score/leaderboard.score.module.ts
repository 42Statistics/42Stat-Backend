import { Module } from '@nestjs/common';
import { ScoreModule } from 'src/api/score/score.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { RedisModule } from 'src/redis/redis.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';

@Module({
  imports: [LeaderboardUtilModule, ScoreModule, DateRangeModule, RedisModule],
  providers: [LeaderboardScoreResolver, LeaderboardScoreService],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
