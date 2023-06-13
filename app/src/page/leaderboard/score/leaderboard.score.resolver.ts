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
import { LeaderboardScoreService } from './leaderboard.score.service';
import { LeaderboardScore } from './models/leaderboard.score.model';

@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardScore)
export class LeaderboardScoreResolver {
  constructor(private leaderboardScoreService: LeaderboardScoreService) {}

  @Query((_returns) => LeaderboardScore)
  async getLeaderboardScore() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElement)
  async total(
    @MyContext() myId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardScoreService.rankingTotal(
      myId,
      paginationIndexArgs,
    );
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyContext() myId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.leaderboardScoreService.rankingByDateTemplate(
      myId,
      paginationIndexArgs,
      dateTemplate,
    );
  }
}
