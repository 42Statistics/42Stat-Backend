import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ScaleTeamSchema,
  scale_team,
} from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { DailyActivityDaoImpl } from './db/dailyActivity.database.dao';
import { DailyActivityService } from './dailyActivity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_team.name, schema: ScaleTeamSchema },
    ]),
  ],
  providers: [DailyActivityDaoImpl, DailyActivityService],
  exports: [DailyActivityService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DailyActivityModule {}
