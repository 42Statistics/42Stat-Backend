import { Module } from '@nestjs/common';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [LeaderboardUtilModule, ExperienceUserModule, CacheUtilModule],
  providers: [LeaderboardExpResolver, LeaderboardExpService],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
