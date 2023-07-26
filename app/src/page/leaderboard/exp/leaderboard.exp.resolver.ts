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
import { LeaderboardExpService } from './leaderboard.exp.service';
import { LeaderboardExp } from './models/leaderboard.exp.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardExp)
export class LeaderboardExpResolver {
  constructor(private readonly leaderboardExpService: LeaderboardExpService) {}

  @Query((_returns) => LeaderboardExp)
  async getLeaderboardExpIncrement() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() myUserId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<LeaderboardElementDateRanged> {
    if (
      !(
        dateTemplate === DateTemplate.CURR_MONTH ||
        dateTemplate === DateTemplate.CURR_WEEK
      )
    ) {
      throw new UnsupportedDateTemplate();
    }

    return await this.leaderboardExpService.rankingByDateTemplate({
      dateTemplate,
      userId: myUserId,
      paginationIndexArgs,
    });
  }
}
