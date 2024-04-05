import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { FeedSchema, feed } from './db/feed.database.schema';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  //imports: [
  //  MongooseModule.forFeature([
  //    {
  //      name: feed.name,
  //      schema: FeedSchema,
  //      discriminators: [
  //        { name: followFeed.name, schema: FollowFeedSchema },
  //        { name: locationFeed.name, schema: LocationFeedSchema },
  //      ],
  //    },
  //  ]),
  //],
  imports: [
    MongooseModule.forFeature([{ name: feed.name, schema: FeedSchema }]),
  ],
  providers: [
    FeedResolver,
    FeedService,
    PaginationCursorService,
    FollowCacheService,
  ],
  exports: [
    FeedService,
    MongooseModule.forFeature([{ name: feed.name, schema: FeedSchema }]),
  ],
})

// eslint-disable-next-line
export class FeedModule {}
