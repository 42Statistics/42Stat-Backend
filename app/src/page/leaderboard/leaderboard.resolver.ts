import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import { Leaderboard } from './models/leaderboard.model';
import { LeaderboardService } from './leaderboard.service';
import { Time } from 'src/util';

@Resolver((_of: unknown) => Leaderboard)
export class LeaderboardResolver {
  constructor(private leaderboardService: LeaderboardService) {}

  //todo
  //   @Query((_returns) => Leaderboard)
  //   async getHomePage() {

  //todo: pagination

  @ResolveField('levelRank', (_returns) => UserRankingDateRanged)
  async levelRank(
    @Args('limit', { defaultValue: 50 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.leaderboardService.levelRank(limit);
  }

  @ResolveField('monthlyExpIncrementRank', (_returns) => [UserRanking])
  async monthlyExpIncrementRank(): Promise<UserRanking[]> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.expIncrementRank(start, end);
  }

  @ResolveField('weeklyExpIncrementRank', (_returns) => [UserRanking])
  async weeklyExpIncrementRank(): Promise<UserRanking[]> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.expIncrementRank(start, end);
  }

  @ResolveField('totalEvalCountRank', (_returns) => [UserRanking])
  async totalEvalCountRank(): Promise<UserRanking[]> {
    return await this.leaderboardService.totalEvalCountRank();
  }

  @ResolveField('monthlyEvalCountRank', (_returns) => UserRankingDateRanged)
  async monthlyEvalCountRank(): Promise<UserRankingDateRanged> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.evalCountRank(start, end);
  }

  @ResolveField('weeklyEvalCountRank', (_returns) => UserRankingDateRanged)
  async weeklyEvalCountRank(): Promise<UserRankingDateRanged> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.evalCountRank(start, end);
  }

  @ResolveField('totalScoreRank', (_returns) => [UserRanking])
  async totalScoreRank(): Promise<UserRanking[]> {
    return await this.leaderboardService.totalScoreRank();
  }

  @ResolveField('monthlyScoreRank', (_returns) => [UserRanking])
  async monthlyScoreRank(): Promise<UserRanking[]> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.scoreRank(start, end);
  }

  @ResolveField('weeklyScoreRank', (_returns) => [UserRanking])
  async weeklyScoreRank(): Promise<UserRanking[]> {
    const start = Time.curr();
    const end = Time.curr();
    return await this.leaderboardService.scoreRank(start, end);
  }
}
