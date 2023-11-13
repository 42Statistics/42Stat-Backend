import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoalitionModule } from 'src/api/coalition/coalition.module';
import { DailyCoalitionScoreService } from './dailyCoalitionScore.service';
import { DailyCoalitionScoreDaoImpl } from './db/dailyCoalitionScore.database.dao';
import {
  dailyCoalitionScoreSchema,
  mv_daily_score_values,
} from './db/dailyCoalitionScore.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: mv_daily_score_values.name, schema: dailyCoalitionScoreSchema },
    ]),
    CoalitionModule,
  ],
  providers: [DailyCoalitionScoreService, DailyCoalitionScoreDaoImpl],
  exports: [DailyCoalitionScoreService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DailyCoalitionScoreModule {}
