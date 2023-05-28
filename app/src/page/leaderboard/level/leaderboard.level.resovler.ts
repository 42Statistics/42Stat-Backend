import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboad.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async getLeaderboardLevel() {
    return {};
  }

  @ResolveField('total', (_returns) => LeaderboardElement)
  async total(): Promise<LeaderboardElement> {
    return await this.leaderboardLevelService.levelRank(99947, 50);
  }
}
