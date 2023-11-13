import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyEvalCountService } from './dailyEvalCount.service';
import { DailyEvalCountDaoImpl } from './db/dailyEvalCount.database.dao';
import {
  dailyUserEvalCountSchema,
  mv_daily_user_scale_team_counts,
} from './db/dailyEvalCount.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: mv_daily_user_scale_team_counts.name,
        schema: dailyUserEvalCountSchema,
      },
    ]),
  ],
  providers: [DailyEvalCountService, DailyEvalCountDaoImpl],
  exports: [DailyEvalCountService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DailyEvalCountModule {}
