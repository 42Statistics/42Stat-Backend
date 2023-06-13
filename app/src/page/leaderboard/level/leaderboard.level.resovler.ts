import { UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { MyContext } from 'src/auth/myContext';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboard.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async getLeaderboardLevel() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElement)
  async total(
    @MyContext() myId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardLevelService.rankingTotal(
      myId,
      paginationIndexArgs,
    );
  }
}
