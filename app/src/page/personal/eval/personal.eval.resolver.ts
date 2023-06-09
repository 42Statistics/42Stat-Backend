import { UseGuards } from '@nestjs/common';
import {
  Args,
  Float,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { CustomAuthGuard } from 'src/auth/customAuthGuard';
import { CustomContext } from 'src/auth/customContext';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PersonalUtilService } from '../util/personal.util.service';
import { PersonalEval, PersonalEvalRoot } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

@UseGuards(CustomAuthGuard)
@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage(
    @CustomContext() myId: number,
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
  ): Promise<PersonalEvalRoot> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myId,
      userId,
      login,
    );

    return await this.personalEvalService.pesronalEvalProfile(targetUserId);
  }

  @ResolveField((_returns) => Int)
  async totalCount(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.count(root.userProfile.id);
  }

  @ResolveField((_returns) => IntDateRanged)
  async countByDateTemplate(
    @Root() root: PersonalEvalRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntDateRanged> {
    return await this.personalEvalService.countByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => Int)
  async totalDuration(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.totalDuration(root.userProfile.id);
  }

  @ResolveField((_returns) => Int)
  async averageDuration(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.averageDuration(root.userProfile.id);
  }

  @ResolveField((_returns) => Float)
  async averageFinalMark(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.averageFinalMark(root.userProfile.id);
  }

  @ResolveField((_returns) => Int)
  async averageFeedbackLength(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.averageFeedbackLength(
      root.userProfile.id,
    );
  }

  @ResolveField((_returns) => Int)
  async averageCommentLength(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.averageCommentLength(
      root.userProfile.id,
    );
  }

  @ResolveField((_returns) => String)
  async latestFeedback(@Root() root: PersonalEvalRoot): Promise<string> {
    return await this.personalEvalService.latestFeedback(root.userProfile.id);
  }

  @ResolveField((_returns) => String)
  async evalLogSearchUrl(@Root() root: PersonalEvalRoot): Promise<string> {
    return await this.personalEvalService.evalLogSearchUrl(root.userProfile.id);
  }
}
