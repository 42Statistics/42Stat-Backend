import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { FeedType } from './dto/feed.dto';
import { FeedService } from './feed.service';
import { Feed } from './model/feed.model';

@UseGuards(StatAuthGuard)
@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}
  @Query((_returns) => [Feed])
  async getFeed(@MyUserId() userId: number): Promise<Feed[]> {
    return await this.feedService.getFeed(userId);
  }

  @Mutation((_returns) => Boolean)
  async updateFeed(@MyUserId() userId: number, feed: Feed): Promise<boolean> {
    await this.feedService.updateFeed(userId, {
      id: 1,
      userId: 81730,
      feedAt: new Date(),
      type: FeedType.FOLLOW,
    });

    return true;
  }
}
