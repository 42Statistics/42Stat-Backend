import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GetEvalLogsArgs } from './dtos/evalLog.dto.getEvalLog';
import { EvalLogService } from './evalLog.service';
import { EvalLog, EvalLogsPaginated } from './models/evalLog.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => EvalLog)
export class EvalLogResolver {
  constructor(private readonly evalLogService: EvalLogService) {}

  @Query((_returns) => EvalLogsPaginated)
  async getEvalLogs(@Args() args: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    return await this.evalLogService.evalLogs(args);
  }
}
