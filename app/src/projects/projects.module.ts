import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resovler';
import { ProjectsService } from './projects.service';

@Module({
  imports: [],
  exports: [],
  providers: [ProjectResolver, ProjectsService],
})
export class ProjectsModule {}
