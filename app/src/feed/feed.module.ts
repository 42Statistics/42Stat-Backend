import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { FeedSchema, feed } from './db/feed.database.schema';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: feed.name, schema: FeedSchema }]),
  ],
  providers: [FeedResolver, FeedService, PaginationCursorService], //, FeedCacheService],
  exports: [FeedService],
})

// eslint-disable-next-line
export class FeedModule {}
