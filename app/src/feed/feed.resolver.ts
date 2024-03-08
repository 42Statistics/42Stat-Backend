import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { FeedType } from './dto/feed.dto';
import { FeedService } from './feed.service';
import { FeedUnion } from './model/feed.model';

@UseGuards(StatAuthGuard)
@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}
  @Query((_returns) => [FeedUnion])
  async getFeed(@MyUserId() userId: number): Promise<(typeof FeedUnion)[]> {
    return await this.feedService.getFeed(userId);
  }

  @Mutation((_returns) => Boolean)
  async updateFeed(
    @MyUserId() userId: number,
    feed: typeof FeedUnion,
  ): Promise<boolean> {
    await this.feedService.updateFeed(userId, {
      id: 1,
      userPreview: {
        id: 12345,
        login: 'test',
        imgUrl: 'testimg',
      },
      at: new Date(),
      type: FeedType.FOLLOW,
      followed: {
        id: 54321,
        login: 'test2',
        imgUrl: 'testimg2',
      },
    });

    return true;
  }
}
