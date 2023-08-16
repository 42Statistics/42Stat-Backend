import { UseFilters, UseGuards } from '@nestjs/common';
import {
  Args,
  Float,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { UserRank } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { PersonalUtilService } from '../util/personal.util.service';
import { PersonalEval, PersonalEvalRoot } from './models/personal.eval.model';
import { PersonalEvalService } from './personal.eval.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => PersonalEval)
export class PersonalEvalResolver {
  constructor(
    private readonly personalEvalService: PersonalEvalService,
    private readonly personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalEval)
  async getPersonalEval(
    @MyUserId() myUserId: number,
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
  ): Promise<PersonalEvalRoot> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myUserId,
      userId,
      login,
    );

    return await this.personalEvalService.pesronalEvalProfile(targetUserId);
  }

  @ResolveField((_returns) => Int)
  async totalCount(@Root() root: PersonalEvalRoot): Promise<number> {
    return await this.personalEvalService.totalCount(root.userProfile.id);
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 24 개월' })
  async countRecords(
    @Root() root: PersonalEvalRoot,
    @Args('last') last: number,
  ): Promise<IntRecord[]> {
    return await this.personalEvalService.countRecords(
      root.userProfile.id,
      Math.max(1, Math.min(last, 24)),
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

  @ResolveField((_returns) => String, { nullable: true })
  async recentComment(@Root() root: PersonalEvalRoot): Promise<string | null> {
    return (await this.personalEvalService.recentComment(root.userProfile.id))
      .value;
  }

  @ResolveField((_returns) => [UserRank])
  async destinyRanking(
    @Root() root: PersonalEvalRoot,
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRank[]> {
    return await this.personalEvalService.destinyRanking(
      root.userProfile.id,
      limit,
    );
  }
}
