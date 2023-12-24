import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { FollowService } from './follow.service';
import { FollowListWithCount, FollowResult } from './model/follow.model';

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
  @Query((_returns) => FollowListWithCount)
  async getFollowerList(
    @MyUserId() userId: number,
    @Args('target') target: string,
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<FollowListWithCount> {
    const followerList = await this.followService.getFollowerList(
      userId,
      target,
      limit,
    );
    const count = await this.followService.getFollowerCount(target);

    return {
      count,
      followList: followerList,
    };
  }

  @UseGuards(StatAuthGuard)
  @Query((_returns) => FollowListWithCount)
  async getFollowingList(
    @MyUserId() userId: number,
    @Args('target') target: string,
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<FollowListWithCount> {
    const followingList = await this.followService.getFollowingList(
      userId,
      target,
      limit,
    );
    const count = await this.followService.getFollowingCount(target);

    return {
      count,
      followList: followingList,
    };
  }
}
