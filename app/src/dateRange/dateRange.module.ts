import { Module } from '@nestjs/common';
import { DateRangeService } from './dateRange.service';

@Module({
  imports: [],
  providers: [DateRangeService],
  exports: [DateRangeService],
})
// eslint-disable-next-line
export class DateRangeModule {}
