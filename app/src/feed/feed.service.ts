import { Injectable } from '@nestjs/common';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import {
  CursorExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { FeedType } from './dto/feed.dto';
import {
  EventFeed,
  FeedPaginationed,
  FeedUnion,
  FollowFeed,
} from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(
    private readonly followCacheService: FollowCacheService,
    private readonly paginationCursorService: PaginationCursorService,
  ) {}

  async getFeed({
    userId,
    args,
  }: {
    userId: number;
    args: PaginationCursorArgs;
  }): Promise<FeedPaginationed> {
    const followFeeds = await this.getFollowFeeds(userId);
    const eventFeeds = await this.getEventFeeds(userId);

    console.log(followFeeds);

    const feeds: (typeof FeedUnion)[] = [...followFeeds, ...eventFeeds];

    //sort로 정렬
    feeds.sort((a, b) => a.at.getTime() - b.at.getTime());

    //if (!feeds.length) {
    //  return this.generateEmptyFeed();
    //}

    //pagination
    const totalcount = feeds.length;
    const hasNextPage = feeds.length > args.first;

    return this.paginationCursorService.toPaginated(
      feeds.slice(0, args.first),
      totalcount,
      hasNextPage,
      cursorExtractor,
    );
  }

  //userId의 피드에 뜰 정보
  async getFollowFeeds(userId: number): Promise<FollowFeed[]> {
    //userId가 팔로우 한 사람들
    const followingList = await this.followCacheService.get(
      userId,
      'following',
    );

    const followFeeds: FollowFeed[] = [];

    //followingList가 팔로우한 사람들
    followingList.map(async (follow) => {
      const followersFollowing = await this.followCacheService.filterByDate(
        follow.userPreview.id,
        'following',
        follow.followAt,
      );

      followFeeds.push(
        ...followersFollowing.map((follower) => {
          return {
            id: 1,
            at: follow.followAt,
            userPreview: follow.userPreview,
            type: FeedType.FOLLOW,
            followed: follower.userPreview,
          };
        }),
      );
    });

    return followFeeds;
  }

  async getEventFeeds(userId: number): Promise<EventFeed[]> {
    return [];
  }

  //fanout-on-write 방식
  async updateFeed(userId: number, feed: typeof FeedUnion): Promise<void> {
    //나의 팔로워 리스트를 가져옴
    const cachedFollowerList = await this.followCacheService.get(
      userId,
      'follower',
    );

    //팔로워들의 feed에 새로 작성한 feed를 추가
    for (const follower of cachedFollowerList) {
      console.log('write feed: ', follower.userPreview.id, feed);
      //await this.feedCacheService.writeFeed(follower.userPreview.id, feed);
    }
  }
}

const cursorExtractor: CursorExtractor<typeof FeedUnion> = (doc) => {
  //todo: cursor 생성
  return doc.id.toString();
};
