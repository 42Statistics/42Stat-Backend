import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import {
  CursorExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { feed } from './db/feed.database.schema';
import { FeedEdge, FeedPage, feedUnion, PageInfo } from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(feed.name)
    private readonly feedModel: Model<feed>,
    private readonly paginationCursorService: PaginationCursorService,
    private readonly followCacheService: FollowCacheService,
    @Inject(CACHE_MANAGER)
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  async getFeedPaginated({
    userId,
    args,
  }: {
    userId: number;
    args: PaginationCursorArgs;
  }): Promise<FeedPage> {
    const feeds = await this.getFeeds(userId);

    console.log(feeds);

    if (args.after) {
      const afterIndex = feeds.findIndex(
        (feed) => cursorExtractor(feed) === args.after,
      );
      feeds.splice(0, afterIndex + 1);
    }

    const edges: FeedEdge[] = feeds.map((feed) => ({
      node: feed,
      cursor: cursorExtractor(feed),
    }));

    const pageInfo: PageInfo = {
      hasNextPage: feeds.length > args.first,
      endCursor: edges.at(-1)?.cursor,
    };

    return {
      edges,
      pageInfo,
    };
  }

  async getFeeds(userId: number): Promise<(typeof feedUnion)[]> {
    const followList = await this.followCacheService.get(userId, 'following');

    const key = `lastMonthFeeds`;
    const feeds = await this.cacheUtilService.get<(typeof feedUnion)[]>(key);

    //cache가 없는 경우 고려
    if (!feeds) {
      console.log('cache miss');
      return [];
    }

    feeds.filter((feed) => {
      const isFollowedUser = followList.some(
        (follow) => follow.userPreview.id === feed.userPreview.id,
      );
      const isAfterFollow = followList.some(
        (follow) => follow.followAt < feed.createdAt,
      );
      return isFollowedUser && isAfterFollow;
    });

    return feeds.flat();
  }
}

const cursorExtractor: CursorExtractor<typeof feedUnion> = (doc) => {
  return `${doc.userPreview.id.toString()} + ${doc.createdAt.toISOString()}`;
};
