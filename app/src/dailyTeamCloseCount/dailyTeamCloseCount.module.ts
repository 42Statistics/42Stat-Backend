import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyTeamCloseCountService } from './dailyTeamCloseCount.service';
import { DailyTeamCloseClountDaoImpl } from './db/dailyTeamCloseCount.database.dao';
import {
  dailyTeamCloseCountSchema,
  mv_daily_team_close_counts,
} from './db/dailyTeamCloseCount.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: mv_daily_team_close_counts.name,
        schema: dailyTeamCloseCountSchema,
      },
    ]),
  ],
  providers: [DailyTeamCloseCountService, DailyTeamCloseClountDaoImpl],
  exports: [DailyTeamCloseCountService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DailyTeamCloseCountModule {}
