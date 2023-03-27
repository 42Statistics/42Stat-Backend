import { Module } from '@nestjs/common';
import { TotalService } from './total.service';
import { TotalResolver } from './total.resolver';

@Module({
  imports: [],
  providers: [TotalResolver, TotalService],
})
export class TotalModule {}
