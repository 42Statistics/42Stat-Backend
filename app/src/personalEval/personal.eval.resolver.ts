import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetEvalInfoArgs } from './dto/getEvalInfo.args';
import { EvalInfoPaginated } from './models/person.eval.info.model';
import { EvalStatSummary, PersonEvalPage } from './models/person.eval.model';
import { PersonalEvalService } from './personal.eval.service';

@Resolver((_of: unknown) => PersonEvalPage)
export class PersonalEvalResolver {
  constructor(private personalEvalService: PersonalEvalService) {}

  @Query((_returns) => PersonEvalPage)
  async getPersonEvalPage() {
    return {
      evalStatSummary: await this.personalEvalService.getSummaryByUid('99947'),
    };
  }

  @ResolveField('evalInfos', (_returns) => EvalInfoPaginated)
  async getEvalInfos(@Args() args: GetEvalInfoArgs) {
    const result = await this.personalEvalService.getEvalInfos(args);

    const ret = result.map((curr: any) => {
      return {
        cursor: 'cursor',
        node: {
          corrector: {
            id: curr.corrector.id,
            login: curr.corrector.login,
            imgUri: null,
            comment: curr.comment,
            correctorRate: 5,
          },
          correcteds: curr.correcteds.map((cur: any) => ({
            id: cur.id,
            login: cur.login,
            imgUri: null,
            isLeader: true,
            feedback: curr.feedback,
          })),
          beginAt: new Date(curr.begin_at),
          finalMark: curr.final_mark,
          flag: {
            id: curr.flag.id,
            name: curr.flag.name,
            isPositive: curr.flag.positive,
          },
          projectPreview: {
            id: '1',
            name: 'oops',
            url: 'https://www.naver.com',
          },
          teamPreview: {
            id: '1',
            name: 'oops',
            url: 'https://www.naver.com',
          },
        },
      };
    });

    console.log(ret[0]);

    return {
      edges: ret.slice(0, 3),
      totalCount: 3,
      pageInfo: {
        hasNextPage: true,
        endCursor: 'this is end cursor',
      },
    };
  }
}
