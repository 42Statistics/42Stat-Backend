import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardLevelResolver } from './leaderboard.level.resovler';
import { LeaderboardLevelService } from './leaderboard.level.service';

@Module({
  imports: [LeaderboardUtilModule, CursusUserModule],
  providers: [LeaderboardLevelResolver, LeaderboardLevelService],
})
// eslint-disable-next-line
export class LeaderboardLevelModule {}
