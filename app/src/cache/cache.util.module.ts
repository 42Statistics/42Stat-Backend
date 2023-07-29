import { Module } from '@nestjs/common';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { CacheUtilRankingService } from './cache.util.ranking.service';
import { CacheUtilService } from './cache.util.service';

@Module({
  imports: [DateRangeModule],
  providers: [CacheUtilService, CacheUtilRankingService],
  exports: [CacheUtilService, CacheUtilRankingService],
})
// eslint-disable-next-line
export class CacheUtilModule {}
