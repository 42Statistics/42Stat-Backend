import { Injectable } from '@nestjs/common';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { FeedUnion } from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(private readonly followCacheService: FollowCacheService) {}

  async getFeed(userId: number): Promise<(typeof FeedUnion)[]> {
    //cache에서 feed를 가져옴

    //없을 시 db에서 가져옴
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
