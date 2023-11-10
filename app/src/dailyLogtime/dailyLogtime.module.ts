import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyLogtimeService } from './dailyLogtime.service';
import { DailyLogtimeDaoImpl } from './db/dailyLogtime.database.dao';
import {
  dailyLogtimeSchema,
  daily_logtimes,
} from './db/dailyLogtime.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: daily_logtimes.name, schema: dailyLogtimeSchema },
    ]),
  ],
  providers: [DailyLogtimeService, DailyLogtimeDaoImpl],
  exports: [DailyLogtimeService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DailyLogtimeModule {}
