import { Module } from '@nestjs/common';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';

@Module({
  imports: [LeaderboardUtilModule],
  providers: [
    LeaderboardScoreResolver,
    LeaderboardScoreService,
    LeaderboardUtilService,
  ],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
