import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LeaderboardMetadata } from './models/leaderboard.metadata.model';
import { LeaderboardMetadataService } from './leaderboard.metadata.service';
import { Promo } from 'src/page/common/models/promo.model';
import { Coalition } from 'src/page/common/models/coalition.model';

@Resolver((_of: unknown) => LeaderboardMetadata)
export class LeaderboardMetadataResolver {
  constructor(
    private readonly leaderboardMetadataService: LeaderboardMetadataService,
  ) {}

  @Query((_returns) => LeaderboardMetadata)
  async getLeaderboardMetadata(): Promise<
    Omit<LeaderboardMetadata, 'promoList' | 'coalitionList'>
  > {
    return {};
  }

  @ResolveField((_returns) => [Promo])
  async promoList(): Promise<Promo[]> {
    return await this.leaderboardMetadataService.promoList();
  }

  @ResolveField((_returns) => [Coalition])
  async coalitionList(): Promise<Coalition[]> {
    return await this.leaderboardMetadataService.coalitionList();
  }
}
