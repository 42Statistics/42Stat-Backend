import { Module } from '@nestjs/common';
import { TeamsModule } from 'src/teams/teams.module';
import { TeamsService } from 'src/teams/teams.service';
import { ScaleTeamsService } from './scaleTeams.service';
import { ScaleTeamsResolver } from './scaleTeams.resolver';

@Module({
  imports: [TeamsModule],
  providers: [ScaleTeamsResolver, ScaleTeamsService, TeamsService],
})
export class ScaleTeamsModule {}
