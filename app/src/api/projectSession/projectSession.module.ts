import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectSessionSchema,
  project_session,
} from './db/projectSession.database.schema';
import { projectSessionService } from './projectSession.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: project_session.name, schema: ProjectSessionSchema },
    ]),
  ],
  providers: [projectSessionService],
  exports: [MongooseModule, projectSessionService],
})
// eslint-disable-next-line
export class ProjectSessionModule {}
