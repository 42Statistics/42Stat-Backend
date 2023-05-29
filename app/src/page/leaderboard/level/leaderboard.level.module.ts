import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LeaderboardLevelService } from './leaderboad.level.service';
import { LeaderboardLevelResolver } from './leaderboard.level.resovler';

@Module({
  imports: [CursusUserModule],
  providers: [
    LeaderboardLevelResolver,
    LeaderboardLevelService,
    CursusUserService,
  ],
})
// eslint-disable-next-line
export class LeaderboardLevelModule {}
