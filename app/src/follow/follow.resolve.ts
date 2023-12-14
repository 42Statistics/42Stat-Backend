import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { FollowService } from './follow.service';
import { FollowResult, FollowUserList } from './model/follow.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation((_returns) => FollowResult)
  async followUser(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<typeof FollowResult> {
    return await this.followService.followUser(userId, login);
  }

  @Mutation((_returns) => FollowResult)
  async unFollowUser(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<typeof FollowResult> {
    return await this.followService.unFollowUser(userId, login);
  }

  @Mutation((_returns) => FollowUserList)
  async getFollowerList(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<FollowUserList> {
    const followUser = await this.followService.getFollowerList(userId, login);
    const count = await this.followService.getFollowerCount(login);

    return {
      count,
      followUser,
    };
  }

  @Mutation((_returns) => FollowUserList)
  async getFollowingList(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<FollowUserList> {
    const followUser = await this.followService.getFollowingList(userId, login);
    const count = await this.followService.getFollowingCount(login);

    return {
      count,
      followUser,
    };
  }
}
