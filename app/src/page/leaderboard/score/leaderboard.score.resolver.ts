import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardScoreService } from './leaderboard.score.service';
import { LeaderboardScore } from './models/leaderboard.score.model';

@Resolver((_of: unknown) => LeaderboardScore)
export class LeaderboardScoreResolver {
  constructor(private leaderboardScoreService: LeaderboardScoreService) {}

  @Query((_returns) => LeaderboardScore)
  async getLeaderboardScore() {
    return {};
  }

  @ResolveField('total', (_returns) => LeaderboardElement)
  async total(): Promise<LeaderboardElement> {
    return await this.leaderboardScoreService.scoreRank(99947);
  }

  @ResolveField('byDateRange', (_returns) => LeaderboardElementDateRanged)
  async byDateRange(
    @Args() dateRangeArgs: DateRangeArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardScoreService.scoreRankByDateRange(
      99947,
      dateRangeArgs,
    );
  }

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(@Args() { dateTemplate }: DateTemplateArgs) {
    return await this.leaderboardScoreService.scoreRankByDateTemplate(
      99947,
      dateTemplate,
    );
  }
}
