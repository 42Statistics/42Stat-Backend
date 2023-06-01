import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetEvalLogsArgs } from './dto/evalLog.dto.getEvalLog';
import { EvalLogService } from './evalLog.service';
import { EvalLog, EvalLogsPaginated } from './models/evalLog.model';

@Resolver((_of: unknown) => EvalLog)
export class EvalLogResolver {
  constructor(private evalLogService: EvalLogService) {}

  @Query((_returns) => EvalLogsPaginated)
  async getEvalLogs(@Args() args: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    return await this.evalLogService.evalLogs(args);
  }
}
