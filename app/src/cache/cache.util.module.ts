import { Module } from '@nestjs/common';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { CacheUtilService } from './cache.util.service';

@Module({
  imports: [DateRangeModule],
  providers: [CacheUtilService],
  exports: [CacheUtilService],
})
// eslint-disable-next-line
export class CacheUtilModule {}
