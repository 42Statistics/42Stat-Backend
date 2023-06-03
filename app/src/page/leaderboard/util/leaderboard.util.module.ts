import { Module } from '@nestjs/common';
import { LeaderboardUtilService } from './leaderboard.util.service';

@Module({
  imports: [],
  providers: [LeaderboardUtilService],
  exports: [LeaderboardUtilService],
})
// eslint-disable-next-line
export class LeaderboardUtilModule {}
