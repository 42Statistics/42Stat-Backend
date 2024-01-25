import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { FollowPaginatedArgs } from './dto/follow.dto';
import { FollowService } from './follow.service';
import { FollowSuccess, MyFollowPaginated } from './model/follow.model';

const pubSub = new PubSub();

@UseFilters(HttpExceptionFilter)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Subscription((_returns) => FollowSuccess, { name: 'followUpdated' })
  followUpdated() {
    return pubSub.asyncIterator('followUpdated');
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => FollowSuccess)
  async followUser(
    @MyUserId() userId: number,
    @Args('targetId') targetId: number,
  ): Promise<FollowSuccess> {
    try {
      const followResult = await this.followService.followUser(
        userId,
        targetId,
      );

      await pubSub.publish('followUpdated', { followUpdated: followResult });

      return followResult;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => FollowSuccess)
  async unfollowUser(
    @MyUserId() userId: number,
    @Args('targetId') targetId: number,
  ): Promise<FollowSuccess> {
    try {
      const followResult = await this.followService.unfollowUser(
        userId,
        targetId,
      );

      await pubSub.publish('followUpdated', { followUpdated: followResult });

      return followResult;
    } catch (e) {
      throw new NotFoundException();
    }
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
  @Query((_returns) => MyFollowPaginated)
  async getFollowerPaginated(
    @MyUserId() userId: number,
    @Args() args: FollowPaginatedArgs,
  ): Promise<MyFollowPaginated> {
    return await this.followService.followerPaginated(userId, args);
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => MyFollowPaginated)
  async getFollowingPaginated(
    @MyUserId() userId: number,
    @Args() args: FollowPaginatedArgs,
  ): Promise<MyFollowPaginated> {
    return await this.followService.followingPaginated(userId, args);
  }
}
