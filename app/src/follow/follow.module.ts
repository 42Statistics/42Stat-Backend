import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { followFeed, FollowFeedSchema } from 'src/feed/db/feed.database.schema';
import { FeedModule } from 'src/feed/feed.module';
import { FeedService } from 'src/feed/feed.service';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { PaginationIndexModule } from 'src/pagination/index/pagination.index.module';
import { follow, FollowSchema } from './db/follow.database.schema';
import { FollowCacheService } from './follow.cache.service';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: follow.name, schema: FollowSchema },
      { name: followFeed.name, schema: FollowFeedSchema },
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
