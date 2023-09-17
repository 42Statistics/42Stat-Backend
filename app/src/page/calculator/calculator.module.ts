import { Module } from '@nestjs/common';
import { LevelModule } from 'src/api/level/level.module';
import { CalculatorResolver } from './calculator.resolver';
import { CalculatorService } from './calculator.service';

@Module({
  imports: [LevelModule],
  providers: [CalculatorResolver, CalculatorService],
})
// eslint-disable-next-line
export class CalculatorModule {}
