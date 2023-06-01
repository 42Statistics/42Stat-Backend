import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { PersonalGeneralService } from 'src/page/personalGeneral/personal.general.service';
import { PersonalEval } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

type PersonalEvalContext = { uid: number };
@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalGeneralService: PersonalGeneralService,
    private cursusUserService: CursusUserService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage(
    @Args('uid', { nullable: true }) uid: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PersonalEvalContext,
  ): Promise<PersonalEval> {
    const cursusUser = await this.cursusUserService.findUser(uid, login);
    context.uid = cursusUser.user.id;

    return {
      correctionPoint: 1,
      currMonthCount: await this.personalEvalService.currMonthCount(
        context.uid,
      ),
      lastMonthCount: await this.personalEvalService.lastMonthCount(
        context.uid,
      ),
      totalCount: await this.personalEvalService.totalCount(context.uid),
      averageDuration: await this.personalEvalService.averageDuration(
        context.uid,
      ),
      averageFinalMark: await this.personalEvalService.averageFinalMark(
        context.uid,
      ),
      averageFeedbackLength:
        await this.personalEvalService.averageFeedbackLength(context.uid),
      averageCommentLength: await this.personalEvalService.averageCommentLength(
        context.uid,
      ),
      userProfile: await this.personalGeneralService.userInfo(99947),
      totalDuration: 1,
      latestFeedback: 'aaa',
      evalLogSearchLink: 'aaa',
    };
  }

  // @ResolveField('userProfile', (_returns) => UserProfile)
  // async getUserInfo() {
  //   return await this.personalGeneralService.getUserInfo(99947);
  // }
}
