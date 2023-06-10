import { UseGuards } from '@nestjs/common';
import { Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MyContext } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { MyInfo, MyInfoRoot } from './models/myInfo.model';
import { MyInfoService } from './myInfo.service';
import { UserTeam } from '../personal/general/models/personal.general.model';

@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => MyInfo)
export class MyInfoResolver {
  constructor(private myInfoService: MyInfoService) {}

  @Query((_returns) => MyInfo)
  async getMyInfo(@MyContext('userId') userId: number): Promise<MyInfoRoot> {
    return await this.myInfoService.myInfoRoot(userId);
  }

  @ResolveField((_returns) => Boolean)
  async isNewMember(@MyContext('userId') userId: number): Promise<boolean> {
    return await this.myInfoService.isNewMember(userId);
  }

  @ResolveField((_returns) => UserTeam, { nullable: true })
  async recentValidatedTeam(
    @MyContext('userId') userId: number,
  ): Promise<UserTeam | null> {
    return this.myInfoService.recentValidatedTeam(userId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async experienceRank(
    @MyContext('userId') userId: number,
  ): Promise<number | undefined> {
    return await this.myInfoService.experienceRank(userId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async scoreRank(
    @MyContext('userId') userId: number,
  ): Promise<number | undefined> {
    return await this.myInfoService.scoreRank(userId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async evalCountRank(
    @MyContext('userId') userId: number,
  ): Promise<number | undefined> {
    return await this.myInfoService.evalCountRank(userId);
  }
}
