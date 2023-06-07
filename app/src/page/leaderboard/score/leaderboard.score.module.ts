import { Module } from '@nestjs/common';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';

@Module({
  imports: [LeaderboardUtilModule, DateRangeModule],
  providers: [
    LeaderboardScoreResolver,
    LeaderboardScoreService,
    LeaderboardUtilService,
    PaginationIndexService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
