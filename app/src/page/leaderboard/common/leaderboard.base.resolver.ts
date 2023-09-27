import { ResolveField, Resolver } from '@nestjs/graphql';
import { Promo } from 'src/page/common/models/promo.model';
import { LeaderboardBaseService } from './leaderboard.base.service';
import { LeaderboardBase } from './models/leaderboard.model';

@Resolver((_of: unknown) => LeaderboardBase)
export class LeaderboardBaseResolver {
  constructor(
    private readonly leaderboardBaseService: LeaderboardBaseService,
  ) {}

  @ResolveField(() => [Promo])
  async promoList(): Promise<Promo[]> {
    return await this.leaderboardBaseService.promoList();
  }
}
