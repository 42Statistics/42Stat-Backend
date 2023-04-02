import { Module } from '@nestjs/common';
import { TimeService } from './time.calculate';

@Module({
  imports: [],
  providers: [TimeService],
  exports: [TimeService],
})
export class CommonModule {}
