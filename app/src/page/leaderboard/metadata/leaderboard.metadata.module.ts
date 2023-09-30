import { Module } from '@nestjs/common';
import { PromoModule } from 'src/api/promo/promo.module';
import { LeaderboardMetadataService } from './leaderboard.metadata.service';
import { LeaderboardMetadataResolver } from './leaderboard.metadata.resolver';

@Module({
  imports: [PromoModule],
  providers: [LeaderboardMetadataService, LeaderboardMetadataResolver],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LeaderboardMetadataModule {}
