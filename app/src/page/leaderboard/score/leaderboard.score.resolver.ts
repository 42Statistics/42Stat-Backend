import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
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
  async total(
    // @Args({ type: () => PaginationIndexArgs }) paginationArgs: PaginationIndexArgs,
    @Args() paginationArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardScoreService.rank(99947, paginationArgs);
  }

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @Args() paginationArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.leaderboardScoreService.rankByDateTemplate(
      99947,
      paginationArgs,
      dateTemplate,
    );
  }
}
