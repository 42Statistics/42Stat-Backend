import { Module } from '@nestjs/common';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardExpResolver } from './leaderboard.exp.resolver';
import { LeaderboardExpService } from './leaderboard.exp.service';

@Module({
  imports: [LeaderboardUtilModule],
  providers: [
    LeaderboardExpResolver,
    LeaderboardExpService,
    LeaderboardUtilService,
  ],
})
// eslint-disable-next-line
export class LeaderboardExpModule {}
