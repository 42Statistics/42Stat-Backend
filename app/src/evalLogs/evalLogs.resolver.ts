import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetEvalLogsArgs } from './dto/evalLogs.dto.getEvalLog';
import { EvalLogsService } from './evalLogs.service';
import { EvalLogs, EvalLogsPaginated } from './models/evalLogs.model';

@Resolver((_of: unknown) => EvalLogs)
export class EvalLogsResolver {
  constructor(private evalLogsService: EvalLogsService) {}

  @Query((_returns) => EvalLogsPaginated)
  async getEvalLogs(@Args() args: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    return await this.evalLogsService.getEvalLogs(args);
  }
}
