import { Module } from '@nestjs/common';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { CacheModule } from 'src/cache/cache.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [
    LeaderboardUtilModule,
    ExperienceUserModule,
    DateRangeModule,
    CacheModule,
  ],
  providers: [LeaderboardExpResolver, LeaderboardExpService],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
