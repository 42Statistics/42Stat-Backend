import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Time } from 'src/util';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardScoreService } from './leaderboard.score.service';
import { LeaderboardScore } from './models/leaderboard.score.model';

@Resolver((_of: unknown) => LeaderboardScore)
export class LeaderboardScoreResolver {
  constructor(private leaderboardScoreService: LeaderboardScoreService) {}

  @Query((_returns) => LeaderboardScore)
  async leaderboardScore() {
    return {};
  }

  @ResolveField('weekly', (_returns) => LeaderboardElementDateRanged)
  async weekly(): Promise<LeaderboardElementDateRanged> {
    const start = Time.curr();
    const end = Time.curr();
    const a = await this.leaderboardScoreService.scoreRank(start, end);

    return {
      from: start,
      to: end,
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }

  @ResolveField('monthly', (_returns) => LeaderboardElementDateRanged)
  async monthly(): Promise<LeaderboardElementDateRanged> {
    const start = Time.curr();
    const end = Time.curr();
    const a = await this.leaderboardScoreService.scoreRank(start, end);

    return {
      from: start,
      to: end,
      data: {
        me: a[0],
        userRanking: a,
      },
    };
  }

  @ResolveField('total', (_returns) => LeaderboardElement)
  async total(): Promise<LeaderboardElement> {
    const a = await this.leaderboardScoreService.totalScoreRank();

    return {
      me: a[0],
      userRanking: a,
    };
  }
}
