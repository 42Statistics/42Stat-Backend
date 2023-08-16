import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { CoalitionModule } from '../coalition/coalition.module';
import { CursusUserCacheService } from './cursusUser.cache.service';
import { CursusUserService } from './cursusUser.service';
import { CursusUserSchema, cursus_user } from './db/cursusUser.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: cursus_user.name, schema: CursusUserSchema },
    ]),
    CoalitionModule,
    CacheUtilModule,
  ],
  providers: [CursusUserService, CursusUserCacheService],
  exports: [
    MongooseModule,
    CursusUserService,
    CursusUserCacheService,
    CoalitionModule,
    CacheUtilModule,
  ],
})
// eslint-disable-next-line
export class CursusUserModule {}
