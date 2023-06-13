import { Module } from '@nestjs/common';
import { ScoreModule } from 'src/api/score/score.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeCoalitionResolver } from './home.coalition.resolver';
import { HomeCoalitionService } from './home.coalition.service';

@Module({
  imports: [ScoreModule, DateRangeModule],
  providers: [HomeCoalitionResolver, HomeCoalitionService],
})
// eslint-disable-next-line
export class HomeCoalitionModule {}
