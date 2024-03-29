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
import { GetLeaderboardElementArgs } from '../common/dtos/leaderboard.dto.getLeaderboardElemenetArgs';
import { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardExpService } from './leaderboard.exp.service';
import { LeaderboardExp } from './models/leaderboard.exp.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardExp)
export class LeaderboardExpResolver {
  constructor(
    private readonly leaderboardExpService: LeaderboardExpService,
    private readonly leaderboardUtilService: LeaderboardUtilService,
  ) {}

  @Query((_returns) => LeaderboardExp)
  async getLeaderboardExpIncrement() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() userId: number,
    @Args() getLeaderboardElementArgs: GetLeaderboardElementArgs,
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

    return await this.leaderboardExpService.rankingByDateTemplate(
      this.leaderboardUtilService.toLeaderboardServiceArgs({
        userId,
        getLeaderboardElementArgs,
        dateTemplate,
      }),
    );
  }
}
