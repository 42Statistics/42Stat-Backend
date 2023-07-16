import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { PersonalUtilService } from '../util/personal.util.service';
import { PersonalVersus } from './models/personal.versus.model';
import { PersonalVersusService } from './personal.versus.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => PersonalVersus)
export class PersonalVersusResolver {
  constructor(
    private personalVersusService: PersonalVersusService,
    private personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalVersus, { nullable: true })
  async getPersonalVersus(
    @MyUserId() myUserId: number,
    @Args('login', { nullable: true }) login?: string,
    @Args('userId', { nullable: true }) userId?: number,
  ): Promise<PersonalVersus | null> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myUserId,
      userId,
      login,
    );

    return this.personalVersusService.personalVersus(targetUserId);
  }
}
