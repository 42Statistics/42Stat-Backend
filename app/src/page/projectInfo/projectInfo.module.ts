import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/api/project/project.module';
import { ProjectSessionModule } from 'src/api/projectSession/projectSession.module';
import { projectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamModule } from 'src/api/team/team.module';
import { TeamService } from 'src/api/team/team.service';
import { ProjectInfoResolver } from './projectInfo.resolver';
import { ProjectInfoService } from './projectInfo.service';

@Module({
  imports: [ProjectModule, ProjectSessionModule, TeamModule],
  providers: [
    ProjectInfoResolver,
    ProjectInfoService,
    projectSessionService,
    TeamService,
  ],
})
// eslint-disable-next-line
export class ProjectInfoModule {}
