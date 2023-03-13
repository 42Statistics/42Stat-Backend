import { Module } from '@nestjs/common';
import { TeamsModule } from 'src/teams/teams.module';
import { TeamsService } from 'src/teams/teams.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ScaleTeamResolver } from './scaleTeam.resolver';
import { ScaleTeamsService } from './scaleTemas.service';

@Module({
  imports: [TeamsModule, UsersModule],
  providers: [ScaleTeamResolver, ScaleTeamsService, TeamsService, UsersService],
})
export class ScaleTeamsModule {}
