import { UseFilters } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeTeamService } from './home.team.service';
import {
  ExamResult,
  ExamResultDateRanged,
  HomeTeam,
  ProjectRank,
  RecentExamResultInput,
} from './models/home.team.model';

@UseFilters(HttpExceptionFilter)
@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(private homeTeamService: HomeTeamService) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return {};
  }

  @ResolveField((_returns) => [ProjectRank])
  async currRegisteredCountRanking(
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<ProjectRank[]> {
    return await this.homeTeamService.currRegisteredCountRanking(limit);
  }

  @ResolveField((_returns) => ExamResult)
  async recentExamResult(
    @Args() { after }: RecentExamResultInput,
  ): Promise<ExamResultDateRanged> {
    return await this.homeTeamService.recentExamResult(after);
  }
}
