import { Module } from '@nestjs/common';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [LeaderboardUtilModule, ExperienceUserModule],
  providers: [LeaderboardExpResolver, LeaderboardExpService],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
