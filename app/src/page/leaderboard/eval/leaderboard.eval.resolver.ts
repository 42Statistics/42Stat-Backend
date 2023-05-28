import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
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
  async total(): Promise<LeaderboardElement> {
    return await this.leaderboardEvalService.evalCountRank(99947);
  }

  @ResolveField('byDateRange', (_returns) => LeaderboardElementDateRanged)
  async byDateRange(
    @Args() dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardEvalService.evalCountRankByDateRange(
      99947,
      dateRange,
    );
  }

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardEvalService.evalCountRankByDateTemplate(
      99947,
      dateTemplate,
    );
  }
}
