import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, project } from './db/project.database.schema';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: project.name, schema: ProjectSchema }]),
  ],
  providers: [ProjectService, ProjectResolver],
  exports: [MongooseModule, ProjectService],
})
// eslint-disable-next-line
export class ProjectModule {}
