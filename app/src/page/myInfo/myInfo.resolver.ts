import { UseFilters, UseGuards } from '@nestjs/common';
import { Int, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { UserTeam } from '../personal/general/models/personal.general.model';
import { MyInfo, MyInfoRoot, MyRecentActivity } from './models/myInfo.model';
import { MyInfoService } from './myInfo.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => MyInfo)
export class MyInfoResolver {
  constructor(private readonly myInfoService: MyInfoService) {}

  @Query((_returns) => MyInfo, { nullable: true })
  async getMyInfo(@MyUserId() myUserId: number): Promise<MyInfoRoot | null> {
    return await this.myInfoService.myInfoRoot(myUserId);
  }

  @ResolveField((_returns) => MyRecentActivity, { nullable: true })
  async myRecentActivity(
    @Root() myInfoRoot?: MyInfoRoot,
  ): Promise<MyRecentActivity | null> {
    return await this.myInfoService.myRecentActivity(myInfoRoot);
  }

  @ResolveField((_returns) => Date, { nullable: true })
  async blackholedAt(@MyUserId() myUserId: number): Promise<Date | null> {
    return await this.myInfoService.blackholedAt(myUserId);
  }

  @ResolveField((_returns) => Boolean)
  async isNewMember(@MyUserId() myUserId: number): Promise<boolean> {
    return (await this.myInfoService.isNewMember(myUserId)) ?? false;
  }

  @ResolveField((_returns) => UserTeam, { nullable: true })
  async lastValidatedTeam(
    @MyUserId() myUserId: number,
  ): Promise<UserTeam | null> {
    return this.myInfoService.lastValidatedTeam(myUserId);
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
