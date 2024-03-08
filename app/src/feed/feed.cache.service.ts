import { Injectable } from '@nestjs/common';
import { FeedUnion } from './model/feed.model';

@Injectable()
export class FeedCacheService {
  constructor() {}

  private feedCache = new Map<number, (typeof FeedUnion)[]>();

  async get(userId: number): Promise<(typeof FeedUnion)[]> {
    return this.feedCache.get(userId) || [];
  }

  async set(userId: number, feed: (typeof FeedUnion)[]): Promise<void> {
    this.feedCache.set(userId, feed);
  }

  async writeFeed(userId: number, feed: typeof FeedUnion): Promise<void> {
    const cachedFeedList = await this.get(userId);
    cachedFeedList.push(feed);
    await this.set(userId, cachedFeedList);
  }
}
