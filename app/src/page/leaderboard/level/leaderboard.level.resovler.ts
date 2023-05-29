import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboad.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async leaderboardLevel() {
    return {};
  }

  @ResolveField('level', (_returns) => LeaderboardElement)
  async level(): Promise<LeaderboardElement> {
    const levelRank = await this.leaderboardLevelService.getLevelRank(50);

    return {
      me: levelRank[0],
      userRanking: levelRank,
    };
  }
}
