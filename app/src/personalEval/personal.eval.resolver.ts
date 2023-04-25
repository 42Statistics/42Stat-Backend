import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { PersonalEval } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalGeneralService: PersonalGeneralService,
  ) {}

  // todo: 이 페이지 이름 바꿉시다
  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage(@Args('uid') uid: number): Promise<PersonalEval> {
    return {
      currMonthCount: await this.personalEvalService.currMonthCount(uid),
      lastMonthCount: await this.personalEvalService.lastMonthCount(uid),
      totalCount: await this.personalEvalService.totalCount(uid),
      averageDuration: await this.personalEvalService.averageDuration(uid),
      averageFinalMark: await this.personalEvalService.averageFinalMark(uid),
      averageFeedbackLength:
        await this.personalEvalService.averageFeedbackLength(uid),
      averageCommentLength: await this.personalEvalService.averageCommentLength(
        uid,
      ),
    };
  }

  @ResolveField('userProfile', (_returns) => UserProfile)
  async getUserInfo() {
    return await this.personalGeneralService.getUserInfo(99947);
  }
}
