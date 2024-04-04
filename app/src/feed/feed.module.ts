import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import {
  FeedSchema,
  FollowFeedSchema,
  LocationFeedSchema,
  feed,
} from './db/feed.database.schema';
import { FeedType } from './dto/feed.dto';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: feed.name,
        schema: FeedSchema,
        discriminators: [
          { name: FeedType.FOLLOW, schema: FollowFeedSchema },
          { name: FeedType.LOCATION, schema: LocationFeedSchema },
        ],
      },
    ]),
  ],
  providers: [FeedResolver, FeedService, PaginationCursorService], //, FeedCacheService],
  exports: [FeedService],
})

// eslint-disable-next-line
export class FeedModule {}
