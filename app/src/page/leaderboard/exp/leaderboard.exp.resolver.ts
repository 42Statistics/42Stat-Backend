import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
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

  @ResolveField('byDateTemplate', (_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @Args() paginationArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    return await this.leaderboardExpService.rankByDateTemplate(
      99947,
      paginationArgs,
      dateTemplate,
    );
  }
}
