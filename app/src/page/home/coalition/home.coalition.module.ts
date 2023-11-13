import { Module } from '@nestjs/common';
import { ScoreModule } from 'src/api/score/score.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { DailyCoalitionScoreModule } from 'src/dailyCoalitionScore/dailyCoalitionScore.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeCoalitionResolver } from './home.coalition.resolver';
import { HomeCoalitionService } from './home.coalition.service';

@Module({
  imports: [
    ScoreModule,
    DateRangeModule,
    DailyCoalitionScoreModule,
    CacheUtilModule,
  ],
  providers: [HomeCoalitionResolver, HomeCoalitionService],
})
// eslint-disable-next-line
export class HomeCoalitionModule {}
