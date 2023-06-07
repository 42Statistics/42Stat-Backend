import { Module } from '@nestjs/common';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { LeaderboardUtilService } from './leaderboard.util.service';

@Module({
  imports: [],
  providers: [LeaderboardUtilService, PaginationIndexService],
  exports: [LeaderboardUtilService],
})
// eslint-disable-next-line
export class LeaderboardUtilModule {}
