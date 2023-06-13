import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { LevelModule } from '../level/level.module';
import {
  ExperienceSchema,
  experience_user,
} from './db/experienceUser.database.schema';
import { ExperienceUserService } from './experienceUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: experience_user.name, schema: ExperienceSchema },
    ]),
    CursusUserModule,
    LevelModule,
  ],
  providers: [ExperienceUserService],
  exports: [
    MongooseModule,
    ExperienceUserService,
    CursusUserModule,
    LevelModule,
  ],
})
// eslint-diable-next-line
export class ExperienceUserModule {}
