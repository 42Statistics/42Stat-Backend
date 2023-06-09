import { UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { MyContext } from 'src/auth/myContext';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardEvalService } from './leaderboard.eval.service';
import { LeaderboardEval } from './models/leaderboard.eval.model';

@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardEval)
export class LeaderboardEvalResolver {
  constructor(private leaderboardEvalService: LeaderboardEvalService) {}

  @Query((_returns) => LeaderboardEval)
  async getLeaderboardEvalCount() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElement)
  async total(
    @MyContext() myId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardEvalService.ranking(myId, paginationIndexArgs);
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyContext() myId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardEvalService.rankingByDateTemplate(
      myId,
      paginationIndexArgs,
      dateTemplate,
    );
  }
}
