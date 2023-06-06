import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Context,
  Float,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { PersonalEval } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PersonalUtilService } from '../util/personal.util.service';

type PersonalEvalContext = { userId: number };
@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private personalEvalService: PersonalEvalService,
    private personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEvalPage(
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PersonalEvalContext,
  ) {
    const targetUserId = await this.personalUtilService.selectUserId(
      context,
      login,
      userId,
    );

    // todo: auth guard
    context.userId = targetUserId;

    return await this.personalEvalService.pesronalEvalProfile(targetUserId);
  }

  @ResolveField((_returns) => Int)
  async totalCount(@Context() context: PersonalEvalContext): Promise<number> {
    return await this.personalEvalService.count(context.userId);
  }

  @ResolveField((_returns) => IntDateRanged)
  async countByDateTemplate(
    @Context() context: PersonalEvalContext,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntDateRanged> {
    return await this.personalEvalService.countByDateTemplate(
      context.userId,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => Int)
  async totalDuration(
    @Context() context: PersonalEvalContext,
  ): Promise<number> {
    return await this.personalEvalService.totalDuration(context.userId);
  }

  @ResolveField((_returns) => Int)
  async averageDuration(
    @Context() context: PersonalEvalContext,
  ): Promise<number> {
    return this.personalEvalService.averageDuration(context.userId);
  }

  @ResolveField((_returns) => Float)
  async averageFinalMark(
    @Context() context: PersonalEvalContext,
  ): Promise<number> {
    return this.personalEvalService.averageFinalMark(context.userId);
  }

  @ResolveField((_returns) => Int)
  async averageFeedbackLength(
    @Context() context: PersonalEvalContext,
  ): Promise<number> {
    return this.personalEvalService.averageFeedbackLength(context.userId);
  }

  @ResolveField((_returns) => Int)
  async averageCommentLength(
    @Context() context: PersonalEvalContext,
  ): Promise<number> {
    return this.personalEvalService.averageCommentLength(context.userId);
  }

  @ResolveField((_returns) => String)
  async latestFeedback(
    @Context() context: PersonalEvalContext,
  ): Promise<string> {
    return this.personalEvalService.latestFeedback(context.userId);
  }

  @ResolveField((_returns) => String)
  async evalLogSearchUrl(
    @Context() context: PersonalEvalContext,
  ): Promise<string> {
    return this.personalEvalService.evalLogSearchUrl(context.userId);
  }
}
