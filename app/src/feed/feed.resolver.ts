import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import { FeedService } from './feed.service';
import { FeedPage } from './model/feed.model';

@UseGuards(StatAuthGuard)
@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}
  @Query((_returns) => FeedPage)
  async getFeed(
    @MyUserId() userId: number,
    @Args() args: PaginationCursorArgs,
  ): Promise<FeedPage> {
    return await this.feedService.getFeedPaginated({ userId, args });
  }
}
