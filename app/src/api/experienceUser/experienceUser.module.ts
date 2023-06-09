import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExperienceSchema,
  experience_user,
} from './db/experienceUser.database.schema';
import { ExperienceUserService } from './experienceUser.service';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { CursusUserService } from '../cursusUser/cursusUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: experience_user.name, schema: ExperienceSchema },
    ]),
    CursusUserModule,
  ],
  providers: [ExperienceUserService, CursusUserService],
  exports: [MongooseModule, ExperienceUserService, CursusUserModule],
})
// eslint-diable-next-line
export class ExperienceUserModule {}
