import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CacheModule } from 'src/cache/cache.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { CoalitionModule } from '../coalition/coalition.module';
import { score, ScoreSchema } from './db/score.database.schema';
import { ScoreCacheService } from './score.cache.service';
import { ScoreService } from './score.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: score.name, schema: ScoreSchema }]),
    CursusUserModule,
    CoalitionModule,
    DateRangeModule,
    CacheModule,
  ],
  providers: [ScoreService, ScoreCacheService],
  exports: [
    MongooseModule,
    ScoreService,
    ScoreCacheService,
    CursusUserModule,
    CoalitionModule,
    CacheModule,
  ],
})
// eslint-disable-next-line
export class ScoreModule {}
