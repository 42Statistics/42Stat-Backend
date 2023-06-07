import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { score, ScoreSchema } from './db/score.database.schema';
import { ScoreService } from './score.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: score.name, schema: ScoreSchema }]),
    CursusUserModule,
  ],
  providers: [ScoreService, CursusUserService],
  exports: [MongooseModule, ScoreService, CursusUserService],
})
// eslint-disable-next-line
export class ScoreModule {}
