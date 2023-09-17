import { UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { CalculatorService } from './calculator.service';
import { ExpTable } from './models/calculator.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => [ExpTable])
export class CalculatorResolver {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Query((_returns) => [ExpTable])
  async getExpTable(): Promise<ExpTable[]> {
    return await this.calculatorService.expTable();
  }
}
