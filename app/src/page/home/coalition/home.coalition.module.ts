import { Module } from '@nestjs/common';
import { ScoreModule } from 'src/api/score/score.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeCoalitionResolver } from './home.coalition.resolver';
import { HomeCoalitionService } from './home.coalition.service';
import { ScoreService } from 'src/api/score/score.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';

@Module({
  imports: [ScoreModule, DateRangeModule],
  providers: [
    HomeCoalitionResolver,
    HomeCoalitionService,
    ScoreService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class HomeCoalitionModule {}
