import { Module } from '@nestjs/common';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { RedisModule } from 'src/redis/redis.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [
    LeaderboardUtilModule,
    ExperienceUserModule,
    DateRangeModule,
    RedisModule,
  ],
  providers: [LeaderboardExpResolver, LeaderboardExpService],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
