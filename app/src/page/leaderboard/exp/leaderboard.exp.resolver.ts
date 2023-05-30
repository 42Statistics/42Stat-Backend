import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
import { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import { LeaderboardExpService } from './leaderboard.exp.service';
import { LeaderboardExp } from './models/leaderboard.exp.model';

@Resolver((_of: unknown) => LeaderboardExp)
export class LeaderboardExpResolver {
  constructor(private leaderboardExpService: LeaderboardExpService) {}

  @Query((_returns) => LeaderboardExp)
  async getLeaderboardExpIncrement() {
    return {};
  }

  @ResolveField('byDateRange', (_returns) => Int)
  async byDateRange(
    @Args() dateRange: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardExpService.expIncrementRankByDateRange(
      99947,
      dateRange,
    );
  }

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardExpService.expIncrementRankByDateTemplate(
      99947,
      dateTemplate,
    );
  }
}
