import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
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
    CacheUtilModule,
  ],
  providers: [ScoreService, ScoreCacheService],
  exports: [
    MongooseModule,
    ScoreService,
    ScoreCacheService,
    CursusUserModule,
    CoalitionModule,
    CacheUtilModule,
  ],
})
// eslint-disable-next-line
export class ScoreModule {}
