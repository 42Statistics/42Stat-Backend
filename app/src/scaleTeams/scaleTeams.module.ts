import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { scale_teams, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamsService } from './scaleTeams.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_teams.name, schema: ScaleTeamSchema },
    ]),
  ],
  providers: [ScaleTeamsService],
  controllers: [],
  exports: [
    // todo
    MongooseModule.forFeature([
      { name: scale_teams.name, schema: ScaleTeamSchema },
    ]),
    ScaleTeamsService,
  ],
})
export class ScaleTeamsModule {}
