import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { scale_team, ScaleTeamSchema } from './db/scaleTeams.database.schema';
import { ScaleTeamsService } from './scaleTeams.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_team.name, schema: ScaleTeamSchema },
    ]),
  ],
  providers: [ScaleTeamsService],
  exports: [MongooseModule, ScaleTeamsService],
})
export class ScaleTeamsModule {}
