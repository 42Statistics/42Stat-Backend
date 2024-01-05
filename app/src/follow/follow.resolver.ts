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
  FollowListPaginated,
  FollowListWithCount,
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

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => FollowResult)
  async followUser(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<typeof FollowResult> {
    const followResult = await this.followService.followUser(userId, target);

    if (followResult.message === 'OK') {
      await pubSub.publish('followUpdated', { followUpdated: followResult });
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
      await pubSub.publish('followUpdated', { followUpdated: followResult });
    }

    return followResult;
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => Boolean)
  async getIsFollowing(
    @MyUserId() userId: number,
    @Args('targetId') targetId: number,
  ): Promise<boolean> {
    return await this.followService.isFollowing(userId, targetId);
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
  @Query((_returns) => FollowListPaginated)
  async getFollowingPaginated(
    @MyUserId() userId: number,
    @Args() args: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    return await this.followService.followingPaginated(userId, args);
  }
}
