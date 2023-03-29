import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { GetEvalInfoArgs } from './dto/getEvalInfo.args';
import { PersonalScaleTeamsPaginated } from './models/personal.eval.scaleTeam.model';
import { PersonalEval } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalGeneralService: PersonalGeneralService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage() {
    return {
      evalProfile: await this.personalEvalService.getSummaryByUid('99947'),
    };
  }

  @ResolveField('scaleTeams', (_returns) => PersonalScaleTeamsPaginated)
  async getEvalInfos(@Args() args: GetEvalInfoArgs) {
    const result = await this.personalEvalService.getEvalInfos(args);

    const ret = result.map((curr: any) => {
      return {
        cursor: 'cursor',
        node: {
          corrector: {
            id: curr.corrector.id,
            login: curr.corrector.login,
            imgUrl: null,
            comment: curr.comment,
            correctorRate: 5,
          },
          correcteds: curr.correcteds.map((cur: any) => ({
            id: cur.id,
            login: cur.login,
            imgUrl: null,
            isLeader: true,
          })),
          feedback: curr.feedback,
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

    return {
      edges: ret.slice(0, 3),
      totalCount: 3,
      pageInfo: {
        hasNextPage: true,
        endCursor: 'this is end cursor',
      },
    };
  }

  @ResolveField('userProfile', (_returns) => UserProfile)
  async getUserInfo() {
    return await this.personalGeneralService.getUserInfo('99947');
  }
}
