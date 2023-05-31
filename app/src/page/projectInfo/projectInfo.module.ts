import { Module } from '@nestjs/common';
import { ProjectInfoResolver } from './projectInfo.resolver';
import { ProjectInfoService } from './projectInfo.service';

@Module({
  imports: [],
  providers: [ProjectInfoResolver, ProjectInfoService],
})
// eslint-disable-next-line
export class ProjectInfoModule {}
