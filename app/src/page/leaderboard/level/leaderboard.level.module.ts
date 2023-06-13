import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { RedisModule, RedisProvider } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardLevelCacheService } from './leaderboard.level.cache.service';
import { LeaderboardLevelResolver } from './leaderboard.level.resovler';
import { LeaderboardLevelService } from './leaderboard.level.service';

@Module({
  imports: [LeaderboardUtilModule, CursusUserModule, RedisModule],
  providers: [
    LeaderboardLevelResolver,
    LeaderboardLevelService,
    LeaderboardLevelCacheService,
    LeaderboardUtilService,
    CursusUserService,
    RedisProvider,
    RedisUtilService,
  ],
})
// eslint-disable-next-line
export class LeaderboardLevelModule {}
