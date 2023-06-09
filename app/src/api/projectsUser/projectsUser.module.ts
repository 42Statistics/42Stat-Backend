import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectsUserSchema,
  projects_user,
} from './db/projectsUser.database.schema';
import { ProjectsUserService } from './projectsUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: projects_user.name, schema: ProjectsUserSchema },
    ]),
  ],
  providers: [ProjectsUserService],
  exports: [MongooseModule, ProjectsUserService],
})
// eslint-disable-next-line
export class ProjectsUserModule {}
