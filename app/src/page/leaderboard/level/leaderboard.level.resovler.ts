import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { LeaderboardFloatElement } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboard.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async getLeaderboardLevel() {
    return {};
  }

  @ResolveField('total', (_returns) => LeaderboardFloatElement)
  async total(
    @Args('userId') userId: number,
    @Args() paginationArgs: PaginationIndexArgs,
  ): Promise<LeaderboardFloatElement> {
    return await this.leaderboardLevelService.rank(
      userId,
      3000, //todo: limit
      paginationArgs,
    );
  }
}
