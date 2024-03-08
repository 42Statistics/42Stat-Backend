import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowModule } from 'src/follow/follow.module';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { FeedSchema, feed } from './db/feed.database.schema';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: feed.name, schema: FeedSchema }]),
    FollowModule,
  ],
  providers: [FeedResolver, FeedService, PaginationCursorService], //, FeedCacheService],
  exports: [],
})

// eslint-disable-next-line
export class FeedModule {}
