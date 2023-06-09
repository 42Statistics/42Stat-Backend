import { Module } from '@nestjs/common';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';

@Module({
  imports: [LeaderboardUtilModule, ExperienceUserModule, DateRangeModule],
  providers: [
    LeaderboardExpResolver,
    LeaderboardExpService,
    LeaderboardUtilService,
    ExperienceUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
