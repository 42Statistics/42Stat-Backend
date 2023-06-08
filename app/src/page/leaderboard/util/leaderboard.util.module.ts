import { Module } from '@nestjs/common';
import { PaginationIndexModule } from 'src/pagination/index/pagination.index.module';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { LeaderboardUtilService } from './leaderboard.util.service';

@Module({
  imports: [PaginationIndexModule],
  providers: [LeaderboardUtilService, PaginationIndexService],
  exports: [LeaderboardUtilService, PaginationIndexService],
})
// eslint-disable-next-line
export class LeaderboardUtilModule {}
