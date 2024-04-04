import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { FeedSchema, feed } from 'src/feed/db/feed.database.schema';
import { FeedModule } from 'src/feed/feed.module';
import { FeedService } from 'src/feed/feed.service';
import { PaginationIndexModule } from 'src/pagination/index/pagination.index.module';
import { FollowSchema, follow } from './db/follow.database.schema';
import { FollowCacheService } from './follow.cache.service';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: follow.name, schema: FollowSchema },
      { name: feed.name, schema: FeedSchema },
    ]),
    FeedModule,
    CursusUserModule,
    PaginationIndexModule,
    CacheUtilModule,
  ],
  providers: [
    FollowResolver,
    FollowService,
    FollowCacheService,
    PaginationCursorService,
    FeedService,
  ],
  exports: [FollowService, FollowCacheService],
})
// eslint-disable-next-line
export class FollowModule {}
