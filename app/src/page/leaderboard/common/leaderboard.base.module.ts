import { Module } from '@nestjs/common';
import { PromoModule } from 'src/api/promo/promo.module';
import { LeaderboardBaseResolver } from './leaderboard.base.resolver';
import { LeaderboardBaseService } from './leaderboard.base.service';

@Module({
  imports: [PromoModule],
  providers: [LeaderboardBaseService, LeaderboardBaseResolver],
})
// eslint-disable-next-line
export class LeaderboardBaseModule {}
