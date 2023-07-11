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
import { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboard.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async getLeaderboardLevel() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() myUserId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args()
    { dateTemplate }: DateTemplateArgs,
  ) {
    if (dateTemplate !== DateTemplate.TOTAL) {
      throw new UnsupportedDateTemplate();
    }

    return await this.leaderboardLevelService.rankingByDateTemplate(
      dateTemplate,
      { userId: myUserId, paginationIndexArgs },
    );
  }
}
