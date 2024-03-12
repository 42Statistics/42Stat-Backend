import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import { FeedType } from './dto/feed.dto';
import { FeedService } from './feed.service';
import { FeedPaginated, FeedUnion } from './model/feed.model';

@UseGuards(StatAuthGuard)
@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}
  @Query((_returns) => FeedPaginated)
  async getFeed(
    @MyUserId() userId: number,
    @Args() args: PaginationCursorArgs,
  ): Promise<FeedPaginated> {
    return await this.feedService.getFeedPaginated({ userId, args });
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
