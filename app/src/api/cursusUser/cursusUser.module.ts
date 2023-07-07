import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { CursusUserCacheService } from './cursusUser.cache.service';
import { CursusUserResolver } from './cursusUser.resolver';
import { CursusUserService } from './cursusUser.service';
import { CursusUserSchema, cursus_user } from './db/cursusUser.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: cursus_user.name, schema: CursusUserSchema },
    ]),
    CacheUtilModule,
  ],
  providers: [CursusUserResolver, CursusUserService, CursusUserCacheService],
  exports: [
    MongooseModule,
    CursusUserService,
    CursusUserCacheService,
    CacheUtilModule,
  ],
})
// eslint-disable-next-line
export class CursusUserModule {}
