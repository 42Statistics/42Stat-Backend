import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { score, ScoreSchema } from './db/score.database.schema';
import { ScoreService } from './score.service';
import { CoalitionModule } from '../coalition/coalition.module';
import { CoalitionService } from '../coalition/coalition.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: score.name, schema: ScoreSchema }]),
    CursusUserModule,
    CoalitionModule,
  ],
  providers: [ScoreService, CursusUserService, CoalitionService],
  exports: [MongooseModule, ScoreService, CursusUserService, CoalitionService],
})
// eslint-disable-next-line
export class ScoreModule {}
