import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { FollowService } from './follow.service';
import { FollowListWithCount, FollowResult } from './model/follow.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

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

  @Mutation((_returns) => FollowResult)
  async followUser(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<typeof FollowResult> {
    return await this.followService.followUser(userId, target);
  }

  @Mutation((_returns) => FollowResult)
  async unfollowUser(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<typeof FollowResult> {
    return await this.followService.unfollowUser(userId, target);
  }

  @Mutation((_returns) => FollowListWithCount)
  async getFollowerList(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<FollowListWithCount> {
    const followerList = await this.followService.getFollowerList(
      userId,
      target,
    );
    const count = await this.followService.getFollowerCount(target);

    return {
      count,
      followList: followerList,
    };
  }

  @Mutation((_returns) => FollowListWithCount)
  async getFollowingList(
    @MyUserId() userId: number,
    @Args('target') target: string,
  ): Promise<FollowListWithCount> {
    const followingList = await this.followService.getFollowingList(
      userId,
      target,
    );
    const count = await this.followService.getFollowingCount(target);

    return {
      count,
      followList: followingList,
    };
  }
}
