import { Module } from '@nestjs/common';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { PaginationIndexModule } from 'src/pagination/index/pagination.index.module';
import { LeaderboardUtilService } from './leaderboard.util.service';

@Module({
  imports: [PaginationIndexModule, DateRangeModule],
  providers: [LeaderboardUtilService],
  exports: [LeaderboardUtilService, PaginationIndexModule, DateRangeModule],
})
// eslint-disable-next-line
export class LeaderboardUtilModule {}
