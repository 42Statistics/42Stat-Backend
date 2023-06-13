import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/redis/redis.module';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { scale_team, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamCacheService } from './scaleTeam.cache.service';
import { ScaleTeamService } from './scaleTeam.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_team.name, schema: ScaleTeamSchema },
    ]),
    CursusUserModule,
    RedisModule,
  ],
  providers: [ScaleTeamService, ScaleTeamCacheService],
  exports: [
    MongooseModule,
    ScaleTeamService,
    ScaleTeamCacheService,
    CursusUserModule,
    RedisModule,
  ],
})
export class ScaleTeamModule {}
