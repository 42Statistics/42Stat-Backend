import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { scale_team, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_team.name, schema: ScaleTeamSchema },
    ]),
  ],
  providers: [ScaleTeamService],
  exports: [MongooseModule, ScaleTeamService],
})
export class ScaleTeamModule {}
