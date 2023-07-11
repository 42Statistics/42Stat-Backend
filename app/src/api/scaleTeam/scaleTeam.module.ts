import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheUtilModule } from 'src/cache/cache.util.module';
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
    CacheUtilModule,
  ],
  providers: [ScaleTeamService, ScaleTeamCacheService],
  exports: [
    MongooseModule,
    ScaleTeamService,
    ScaleTeamCacheService,
    CursusUserModule,
    CacheUtilModule,
  ],
})
// eslint-disable-next-line
export class ScaleTeamModule {}
