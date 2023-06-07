import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardEvalService } from './leaderboard.eval.service';
import { LeaderboardEval } from './models/leaderboard.eval.model';

@Resolver((_of: unknown) => LeaderboardEval)
export class LeaderboardEvalResolver {
  constructor(private leaderboardEvalService: LeaderboardEvalService) {}

  @Query((_returns) => LeaderboardEval)
  async getLeaderboardEvalCount() {
    return {};
  }

  @ResolveField('total', (_returns) => LeaderboardElement)
  async total(
    // @Args({type: () => PaginationIndexArgs}) paginationArgs: PaginationIndexArgs,
    @Args() paginationArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardEvalService.rank(99947, paginationArgs);
  }

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @Args() paginationArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardEvalService.rankByDateTemplate(
      99947,
      paginationArgs,
      dateTemplate,
    );
  }
}
