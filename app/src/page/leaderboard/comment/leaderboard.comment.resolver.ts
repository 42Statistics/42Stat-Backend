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
import { LeaderboardCommentService } from './leaderboard.comment.service';
import { LeaderboardComment } from './models/leaderboard.comment.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardComment)
export class LeaderboardCommentResolver {
  constructor(
    private readonly leaderboardCommentService: LeaderboardCommentService,
    private readonly leaderboardUtilService: LeaderboardUtilService,
  ) {}

  @Query((_returns) => LeaderboardComment)
  async getLeaderboardComment() {
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
        dateTemplate === DateTemplate.TOTAL ||
        dateTemplate === DateTemplate.CURR_MONTH ||
        dateTemplate === DateTemplate.CURR_WEEK
      )
    ) {
      throw new UnsupportedDateTemplate();
    }

    return await this.leaderboardCommentService.rankingByDateTemplate(
      this.leaderboardUtilService.toLeaderboardServiceArgs({
        userId,
        getLeaderboardElementArgs,
        dateTemplate,
      }),
    );
  }
}
