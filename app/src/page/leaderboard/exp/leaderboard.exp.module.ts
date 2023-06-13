import { Module } from '@nestjs/common';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { RedisModule, RedisProvider } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardExpCacheService } from './leaderboard.exp.cache.service';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [
    LeaderboardUtilModule,
    ExperienceUserModule,
    DateRangeModule,
    RedisModule,
  ],
  providers: [
    LeaderboardExpResolver,
    LeaderboardExpService,
    LeaderboardExpCacheService,
    LeaderboardUtilService,
    ExperienceUserService,
    DateRangeService,
    RedisProvider,
    RedisUtilService,
  ],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
