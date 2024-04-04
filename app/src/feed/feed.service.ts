import { Injectable } from '@nestjs/common';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import {
  CursorExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { FeedPaginated, FollowFeed, feedUnion } from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(
    private readonly paginationCursorService: PaginationCursorService,
  ) {}

  async getFeedPaginated({
    userId,
    args,
  }: {
    userId: number;
    args: PaginationCursorArgs;
  }): Promise<FeedPaginated> {
    //pagination을 위해 함수 분리
    //id만 가진 db를 만들어 매번 로컬피드캐시에서 join하기 <- 캐시작업때 고려
    const followFeeds = await this.getFollowFeeds(userId);

    const feeds: (typeof feedUnion)[] = [...followFeeds];

    //if (!feeds.length) {
    //  return this.generateEmptyFeed();
    //}

    //sort로 정렬 (최신순 고정)
    feeds.sort((a, b) => b.at.getTime() - a.at.getTime());

    //pagination
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

  //userId의 피드에 뜰 정보
  async getFollowFeeds(userId: number): Promise<FollowFeed[]> {
    ////followingList가 팔로우한 사람들
    //followingList.map(async (follow) => {
    //  const followersFollowing = await this.followCacheService.filterByDate(
    //    follow.userPreview.id,
    //    'following',
    //    follow.followAt,
    //  );

    //  followFeeds.push(
    //    ...followersFollowing.map((follower) => {
    //      return {
    //        id: 1,
    //        at: follow.followAt,
    //        userPreview: follow.userPreview,
    //        type: FeedType.FOLLOW,
    //        followed: follower.userPreview,
    //      };
    //    }),
    //  );
    //});

    return [];
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
  //}
}

const cursorExtractor: CursorExtractor<typeof feedUnion> = (doc) => {
  return `${doc.id.toString()} + ${doc.at.toISOString()}`;
};
