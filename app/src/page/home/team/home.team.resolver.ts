import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { RecentExamResultArgs } from './dtos/home.team.dto.recentExamResultArgs';
import { HomeTeamService } from './home.team.service';
import {
  ExamResult,
  ExamResultDateRanged,
  HomeTeam,
  ProjectRank,
} from './models/home.team.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(private readonly homeTeamService: HomeTeamService) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return {};
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 60 일' })
  async teamCloseRecord(@Args('last') last: number): Promise<IntRecord[]> {
    return await this.homeTeamService.teamCloseRecord(
      Math.max(1, Math.min(last, 60)),
    );
  }

  @ResolveField((_returns) => [ProjectRank])
  async currRegisteredCountRanking(
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<ProjectRank[]> {
    return await this.homeTeamService.currRegisteredCountRanking(limit);
  }

  @ResolveField((_returns) => ExamResult)
  async recentExamResult(
    @Args() { skip }: RecentExamResultArgs,
  ): Promise<ExamResultDateRanged> {
    return await this.homeTeamService.recentExamResult(skip);
  }
}
