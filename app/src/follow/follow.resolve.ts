import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import {
  FollowListPaginatedArgs,
  FollowSortOrder,
} from './dto/follow.dto.getFollowList';
import { FollowService } from './follow.service';
import {
  FollowList,
  FollowListPaginated,
  FollowResult,
} from './model/follow.model';

const pubSub = new PubSub();

@UseFilters(HttpExceptionFilter)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Subscription((_returns) => FollowResult, {
    name: 'followUpdated',
    filter: (payload, _variables) => {
      return payload.followUpdated.message === 'OK';
    },
  })
  followUpdated() {
    return pubSub.asyncIterator('followUpdated');
  }

  @Mutation((_returns) => FollowResult, {
    description: '프론트 테스트용 임시 함수',
  })
  async MakeFollow(
    @Args('to') to: string,
    @Args('from') from: string,
    @Args('type') type: 'follow' | 'unfollow',
  ): Promise<typeof FollowResult> {
    return await this.followService.MakeFollowUser(to, from, type);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => FollowResult)
  async followUser(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<typeof FollowResult> {
    const followResult = await this.followService.followUser(userId, target);

    if (followResult.message === 'OK') {
      pubSub.publish('followUpdated', { followUpdated: followResult });
    }

    return followResult;
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => FollowResult)
  async unfollowUser(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<typeof FollowResult> {
    const followResult = await this.followService.unfollowUser(userId, target);

    if (followResult.message === 'OK') {
      pubSub.publish('followUpdated', { followUpdated: followResult });
    }

    return followResult;
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => [FollowList])
  async getFollowerList(
    @MyUserId() userId: number,
    @Args('target') target: string,
    @Args('limit', { defaultValue: 3 }) limit: number,
    @Args('sortOrder') sortOrder: FollowSortOrder,
  ): Promise<FollowList[]> {
    return await this.followService.followerList(
      userId,
      target,
      limit,
      sortOrder,
    );
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => FollowListPaginated)
  async getFollowerPaginated(
    @MyUserId() userId: number,
    @Args() args: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    return await this.followService.followerPaginated(userId, args);
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => [FollowList])
  async getFollowingList(
    @MyUserId() userId: number,
    @Args('target') target: string,
    @Args('limit', { defaultValue: 3 }) limit: number,
    @Args('sortOrder') sortOrder: FollowSortOrder,
  ): Promise<FollowList[]> {
    return await this.followService.followingList(
      userId,
      target,
      limit,
      sortOrder,
    );
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => FollowListPaginated)
  async getFollowingPaginated(
    @MyUserId() userId: number,
    @Args() args: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    return await this.followService.followingPaginated(userId, args);
  }
}
