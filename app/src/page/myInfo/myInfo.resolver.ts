import { UseFilters, UseGuards } from '@nestjs/common';
import { Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { UserTeam } from '../personal/general/models/personal.general.model';
import { MyInfo, MyInfoRoot } from './models/myInfo.model';
import { MyInfoService } from './myInfo.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => MyInfo)
export class MyInfoResolver {
  constructor(private myInfoService: MyInfoService) {}

  @Query((_returns) => MyInfo)
  async getMyInfo(@MyUserId() myUserId: number): Promise<MyInfoRoot> {
    return await this.myInfoService.myInfoRoot(myUserId);
  }

  @ResolveField((_returns) => Boolean)
  async isNewMember(@MyUserId() myUserId: number): Promise<boolean> {
    return await this.myInfoService.isNewMember(myUserId);
  }

  @ResolveField((_returns) => UserTeam, { nullable: true })
  async recentValidatedTeam(
    @MyUserId() myUserId: number,
  ): Promise<UserTeam | null> {
    return this.myInfoService.recentValidatedTeam(myUserId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async experienceRank(
    @MyUserId() myUserId: number,
  ): Promise<number | undefined> {
    return await this.myInfoService.experienceRank(myUserId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async scoreRank(@MyUserId() myUserId: number): Promise<number | undefined> {
    return await this.myInfoService.scoreRank(myUserId);
  }

  @ResolveField((_returns) => Int, {
    description: '이번 주 기준 입니다',
    nullable: true,
  })
  async evalCountRank(
    @MyUserId() myUserId: number,
  ): Promise<number | undefined> {
    return await this.myInfoService.evalCountRank(myUserId);
  }
}
