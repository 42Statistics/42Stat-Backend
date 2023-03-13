import { Module } from '@nestjs/common';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TeamResolver } from './team.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TeamResolver, TeamsService, UsersService, ProjectsService],
})
export class TeamsModule {}
