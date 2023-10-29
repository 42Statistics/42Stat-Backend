import { Module } from '@nestjs/common';
import { CoalitionModule } from 'src/api/coalition/coalition.module';
import { PromoModule } from 'src/api/promo/promo.module';
import { LeaderboardMetadataResolver } from './leaderboard.metadata.resolver';
import { LeaderboardMetadataService } from './leaderboard.metadata.service';

@Module({
  imports: [PromoModule, CoalitionModule],
  providers: [LeaderboardMetadataService, LeaderboardMetadataResolver],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LeaderboardMetadataModule {}
