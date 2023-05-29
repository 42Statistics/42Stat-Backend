import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardEvalService } from './leaderboard.eval.service';
import { LeaderboardEval } from './models/leaderboard.eval.model';

@Resolver((_of: unknown) => LeaderboardEval)
export class LeaderboardEvalResolver {
  constructor(private leaderboardEvalService: LeaderboardEvalService) {}

  @Query((_returns) => LeaderboardEval)
  async leaderboardEvalCount() {
    return {};
  }

  @ResolveField('weekly', (_returns) => LeaderboardElementDateRanged)
  async weekly(): Promise<LeaderboardElementDateRanged> {
    const a = await this.leaderboardEvalService.evalCountRank(
      new Date('2023-05-01'),
      new Date('2023-05-08'),
    );

    return {
      from: new Date('2023-05-01'),
      to: new Date('2023-05-08'),
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }

  @ResolveField('monthly', (_returns) => LeaderboardElementDateRanged)
  async monthly(): Promise<LeaderboardElementDateRanged> {
    const a = await this.leaderboardEvalService.evalCountRank(
      new Date('2023-05-01'),
      new Date('2023-06-01'),
    );

    return {
      from: new Date('2023-05-01'),
      to: new Date('2023-06-01'),
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }

  @ResolveField('total', (_returns) => LeaderboardElement)
  async total(): Promise<LeaderboardElement> {
    const a = await this.leaderboardEvalService.totalEvalCountRank();

    return {
      me: a[0],
      userRanking: a,
    };
  }
}
