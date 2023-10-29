import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import {
  DateTemplate,
  DateTemplateArgs,
  UnsupportedDateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GetLeaderboardElementArgs } from '../common/dtos/leaderboard.dto.getLeaderboardElemenetArgs';
import { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardEvalService } from './leaderboard.eval.service';
import { LeaderboardEval } from './models/leaderboard.eval.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardEval)
export class LeaderboardEvalResolver {
  constructor(
    private readonly leaderboardEvalService: LeaderboardEvalService,
    private readonly leaderboardUtilService: LeaderboardUtilService,
  ) {}

  @Query((_returns) => LeaderboardEval)
  async getLeaderboardEvalCount() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() userId: number,
    @Args() getLeaderboardElementArgs: GetLeaderboardElementArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    if (
      !(
        dateTemplate === DateTemplate.TOTAL ||
        dateTemplate === DateTemplate.CURR_MONTH ||
        dateTemplate === DateTemplate.CURR_WEEK
      )
    ) {
      throw new UnsupportedDateTemplate();
    }

    return await this.leaderboardEvalService.rankingByDateTemplate(
      this.leaderboardUtilService.toLeaderboardServiceArgs({
        userId,
        getLeaderboardElementArgs,
        dateTemplate,
      }),
    );
  }
}
