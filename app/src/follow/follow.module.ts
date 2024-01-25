import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { PaginationIndexModule } from 'src/pagination/index/pagination.index.module';
import { FollowSchema, follow } from './db/follow.database.schema';
import { FollowCacheService } from './follow.cache.service';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: follow.name, schema: FollowSchema }]),
    CursusUserModule,
    PaginationIndexModule,
    CacheUtilModule,
  ],
  providers: [FollowResolver, FollowService, FollowCacheService],
  exports: [FollowService, FollowCacheService],
})
// eslint-disable-next-line
export class FollowModule {}
