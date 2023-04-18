import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetEvalLogsArgs } from './dto/evalLogs.dto.getEvalLog';
import { EvalLogs } from './models/evalLogs.model';
import { EvalLogsService } from './evalLogs.service';

@Resolver((_of: unknown) => EvalLogs)
export class EvalLogsResolver {
  constructor(private evalLogsService: EvalLogsService) {}

  @Query((_returns) => [EvalLogs])
  async getEvalLogs(@Args() args: GetEvalLogsArgs): Promise<EvalLogs[]> {
    return await this.evalLogsService.getEvalLogs(args);
  }
}
