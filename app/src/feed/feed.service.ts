import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import {
  CursorExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { feed } from './db/feed.database.schema';
import { FeedPaginated, feedUnion } from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(feed.name)
    private readonly feedModel: Model<feed>,
    private readonly paginationCursorService: PaginationCursorService,
    private readonly followCacheService: FollowCacheService,
  ) {}

  async getFeedPaginated({
    userId,
    args,
  }: {
    userId: number;
    args: PaginationCursorArgs;
  }): Promise<FeedPaginated> {
    const feeds = await this.getFeeds(userId);

    if (args.after) {
      const afterIndex = feeds.findIndex(
        (feed) => cursorExtractor(feed) === args.after,
      );
      feeds.splice(0, afterIndex + 1);
    }

    return this.paginationCursorService.toPaginated(
      feeds.slice(0, args.first),
      feeds.length,
      feeds.length > args.first,
      cursorExtractor,
    );
  }

  async getFeeds(userId: number): Promise<(typeof feedUnion)[]> {
    const followList = await this.followCacheService.get(userId, 'following');

    const conditions = followList.map((follow) => ({
      'userPreview.id': follow.userPreview.id,
      createdAt: { $gt: follow.followAt },
    }));

    const feeds = await Promise.all(
      conditions.map(async (condition) => {
        const aggregate = this.feedModel.aggregate<typeof feedUnion>();

        const feed = await aggregate
          .match(condition)
          .sort({ createdAt: -1 })
          .project({
            _id: 0,
            __v: 0,
          });

        return feed;
      }),
    );

    return feeds.flat();
  }

  ////fanout-on-write 방식
  //async updateFeed(userId: number, feed: typeof FeedUnion): Promise<void> {
  //  //나의 팔로워 리스트를 가져옴
  //  const cachedFollowerList = await this.followCacheService.get(
  //    userId,
  //    'follower',
  //  );

  //  //팔로워들의 feed에 새로 작성한 feed를 추가
  //  for (const follower of cachedFollowerList) {
  //    console.log('write feed: ', follower.userPreview.id, feed);
  //    //await this.feedCacheService.writeFeed(follower.userPreview.id, feed);
  //  }
  //}

  //private generateEmptyFeed(): FeedPaginated {
  //  return this.paginationCursorService.toPaginated<typeof FeedUnion>(
  //    [],
  //    0,
  //    false,
  //    cursorExtractor,
  //  );
}

const cursorExtractor: CursorExtractor<typeof feedUnion> = (doc) => {
  return `${doc.userPreview.id.toString()} + ${doc.createdAt.toISOString()}`;
};
