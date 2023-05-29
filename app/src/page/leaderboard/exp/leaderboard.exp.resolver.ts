import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import { LeaderboardExpService } from './leaderboard.exp.service';
import { LeaderboardExp } from './models/leaderboard.exp.model';

@Resolver((_of: unknown) => LeaderboardExp)
export class LeaderboardExpResolver {
  constructor(private leaderboardExpService: LeaderboardExpService) {}

  @Query((_returns) => LeaderboardExp)
  async leaderboardExpIncrement() {
    return {};
  }

  @ResolveField('weekly', (_returns) => LeaderboardElementDateRanged)
  async weekly(): Promise<LeaderboardElementDateRanged> {
    const a = await this.leaderboardExpService.expIncrementRank(
      new Date(),
      new Date(),
    );

    return {
      from: new Date(),
      to: new Date(),
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }

  @ResolveField('monthly', (_returns) => LeaderboardElementDateRanged)
  async monthly(): Promise<LeaderboardElementDateRanged> {
    const a = await this.leaderboardExpService.expIncrementRank(
      new Date(),
      new Date(),
    );

    return {
      from: new Date(),
      to: new Date(),
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }
}
