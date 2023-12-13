import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { follow } from './db/follow.database.schema';
import { FollowService } from './follow.service';
import { FollowSuccess, UserList } from './model/follow.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation((_returns) => FollowSuccess)
  async followUser(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<follow> {
    return await this.followService.followUser(userId, login);
  }

  @Mutation((_returns) => FollowSuccess)
  async unfollowUser(
    @MyUserId() userId: number,
    @Args('login') login: string,
  ): Promise<follow> {
    return await this.followService.unfollowUser(userId, login);
  }

  @Mutation((_returns) => UserList)
  async getFollowerList(login: string): Promise<UserList> {
    const user = await this.followService.getFollowerList(login);
    const count = await this.followService.getFollowerCount(login);

    return {
      count,
      user,
    };
  }

  @Mutation((_returns) => UserList)
  async getFollowingList(login: string): Promise<UserList> {
    const user = await this.followService.getFollowingList(login);
    const count = await this.followService.getFollowingCount(login);

    return {
      count,
      user,
    };
  }
}
