import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { MyUserId } from 'src/auth/myContext';
import {
  DateTemplate,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
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

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() myUserId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args({ description: 'TOTAL, CURR_MONTH, CURR_WEEK 만 가능합니다' })
    { dateTemplate }: DateTemplateArgs,
  ) {
    if (
      !(
        dateTemplate === DateTemplate.TOTAL ||
        dateTemplate === DateTemplate.CURR_MONTH ||
        dateTemplate === DateTemplate.CURR_WEEK
      )
    ) {
      throw new BadRequestException();
    }

    return await this.leaderboardScoreService.rankingByDateTemplate(
      myUserId,
      paginationIndexArgs,
      dateTemplate,
    );
  }
}
