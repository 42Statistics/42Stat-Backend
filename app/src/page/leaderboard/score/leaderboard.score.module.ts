import { Module } from '@nestjs/common';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardScoreResolver } from './leaderboard.score.resolver';
import { LeaderboardScoreService } from './leaderboard.score.service';

@Module({
  imports: [LeaderboardUtilModule, ScoreModule, DateRangeModule],
  providers: [
    LeaderboardScoreResolver,
    LeaderboardScoreService,
    LeaderboardUtilService,
    ScoreService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class LeaderboardScoreModule {}
