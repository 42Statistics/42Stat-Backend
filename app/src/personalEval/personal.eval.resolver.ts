import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetEvalInfoArgs } from './dto/getEvalInfo.args';
import { EvalInfoPaginated } from './models/person.eval.info.model';
import { EvalStatSummary, PersonEvalPage } from './models/person.eval.model';

@Resolver((_of: unknown) => PersonEvalPage)
export class PersonalEvalResolver {
  @Query((_returns) => PersonEvalPage)
  async getPersonEvalPage() {
    const temp: EvalStatSummary = {
      currMonthEvalCnt: 7,
      lastMonthEvalCnt: 5,
      averageEvalDuration: 32,
      averageFinalMark: 107.2,
      averageFeedbackLength: 240,
    };

    return { evalStatSummary: temp };
  }

  @ResolveField('evalInfos', (_returns) => [EvalInfoPaginated])
  async getEvalInfos(@Args() args: GetEvalInfoArgs) {}
}
