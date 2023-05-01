import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/cursus_user/cursusUser.module';
import { score, ScoreSchema } from './db/score.database.schema';
import { ScoreService } from './score.service';
import { CoalitionsUserModule } from 'src/coalitions_user/coalitionsUser.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: score.name, schema: ScoreSchema }]),
    CursusUserModule,
    CoalitionsUserModule,
  ],
  providers: [ScoreService],
  exports: [MongooseModule, ScoreService],
})
// eslint-disable-next-line
export class ScoreModule {}
