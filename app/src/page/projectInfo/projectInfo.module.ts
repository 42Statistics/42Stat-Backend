import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/api/project/project.module';
import { TeamModule } from 'src/api/team/team.module';
import { TeamService } from 'src/api/team/team.service';
import { ProjectInfoResolver } from './projectInfo.resolver';
import { ProjectInfoService } from './projectInfo.service';

@Module({
  imports: [ProjectModule, TeamModule],
  providers: [ProjectInfoResolver, ProjectInfoService, TeamService],
})
// eslint-disable-next-line
export class ProjectInfoModule {}
