import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserResolver } from './cursusUser.resolver';
import { CursusUserService } from './cursusUser.service';
import { CursusUserSchema, cursus_user } from './db/cursusUser.database.schema';
import { CursusUserCacheService } from './cursusUser.cache.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: cursus_user.name, schema: CursusUserSchema },
    ]),
    RedisModule,
  ],
  providers: [CursusUserResolver, CursusUserService, CursusUserCacheService],
  exports: [
    MongooseModule,
    CursusUserService,
    CursusUserCacheService,
    RedisModule,
  ],
})
// eslint-disable-next-line
export class CursusUserModule {}
