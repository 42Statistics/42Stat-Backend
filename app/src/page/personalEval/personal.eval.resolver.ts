import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { PersonalGeneralService } from 'src/page/personalGeneral/personal.general.service';
import { PersonalEval } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

type PersonalEvalContext = { userId: number };
@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalGeneralService: PersonalGeneralService,
    private cursusUserService: CursusUserService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage(
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PersonalEvalContext,
  ): Promise<PersonalEval> {
    const cursusUser = await this.cursusUserService.findUser(userId, login);
    context.userId = cursusUser.user.id;

    return {
      correctionPoint: 1,
      currMonthCount: await this.personalEvalService.currMonthCount(
        context.userId,
      ),
      lastMonthCount: await this.personalEvalService.lastMonthCount(
        context.userId,
      ),
      totalCount: await this.personalEvalService.totalCount(context.userId),
      averageDuration: await this.personalEvalService.averageDuration(
        context.userId,
      ),
      averageFinalMark: await this.personalEvalService.averageFinalMark(
        context.userId,
      ),
      averageFeedbackLength:
        await this.personalEvalService.averageFeedbackLength(context.userId),
      averageCommentLength: await this.personalEvalService.averageCommentLength(
        context.userId,
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
