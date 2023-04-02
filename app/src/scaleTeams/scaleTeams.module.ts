import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeService } from 'src/common/time.calculate';
import { scale_teams, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamsService } from './scaleTeams.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_teams.name, schema: ScaleTeamSchema },
    ]),
  ],
  providers: [ScaleTeamsService, TimeService],
  controllers: [],
  exports: [
    MongooseModule.forFeature([
      { name: scale_teams.name, schema: ScaleTeamSchema },
    ]),
    ScaleTeamsService,
  ],
})
export class ScaleTeamsModule {}
