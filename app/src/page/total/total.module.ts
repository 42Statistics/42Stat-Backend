import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [CoalitionsUserModule],
  providers: [TotalResolver, TotalService],
})
export class TotalModule {}
