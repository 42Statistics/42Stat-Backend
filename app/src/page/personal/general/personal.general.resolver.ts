import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DailyActivityType } from 'src/dailyActivity/dailyActivity.dto';
import { DailyActivityService } from 'src/dailyActivity/dailyActivity.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { PersonalUtilService } from '../util/personal.util.service';
import { Character } from './character/models/personal.general.character.model';
import { PersonalGeneralCharacterService } from './character/personal.general.character.service';
import {
  DailyActivity,
  DailyActivityDetailRecordUnion,
  GetDailyActivitiesArgs,
  GetDailyActivityDetailRecordsArgs,
} from './models/personal.general.dailyActivity.model';
import {
  LevelRecord,
  PersonalGeneral,
  PersonalGeneralRoot,
  PreferredClusterDateRanged,
  PreferredTimeDateRanged,
  UserScoreInfo,
  UserTeamInfo,
} from './models/personal.general.model';
import { PersonalGeneralService } from './personal.general.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(
    private readonly personalGeneralService: PersonalGeneralService,
    private readonly personalUtilService: PersonalUtilService,
    private readonly personalGeneralCharacterService: PersonalGeneralCharacterService,
    private readonly dateRangeService: DateRangeService,
    private readonly dailyActiviyService: DailyActivityService,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonalGeneral(
    @MyUserId() myUserId: number,
    @Args('login', { nullable: true }) login?: string,
    @Args('userId', { nullable: true }) userId?: number,
  ): Promise<PersonalGeneralRoot> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myUserId,
      userId,
      login,
    );

    return await this.personalGeneralService.personalGeneralProfile(
      targetUserId,
    );
  }

  @ResolveField((_returns) => UserScoreInfo)
  async scoreInfo(
    @Root() root: PersonalGeneralRoot,
  ): Promise<UserScoreInfo | null> {
    return await this.personalGeneralService.scoreInfo(root.userProfile.id);
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 24 개월' })
  async logtimeRecords(
    @Root() root: PersonalGeneralRoot,
    @Args('last') last: number,
  ): Promise<IntRecord[]> {
    return await this.personalGeneralService.logtimeRecords(
      root.userProfile.id,
      Math.max(1, Math.min(last, 24)),
    );
  }

  @ResolveField((_returns) => PreferredTimeDateRanged)
  async preferredTimeByDateTemplate(
    @Root() root: PersonalGeneralRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredTimeDateRanged> {
    return await this.personalGeneralService.preferredTimeByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => PreferredClusterDateRanged)
  async preferredClusterByDateTemplate(
    @Root() root: PersonalGeneralRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredClusterDateRanged> {
    return await this.personalGeneralService.preferredClusterByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => UserTeamInfo)
  async teamInfo(@Root() root: PersonalGeneralRoot): Promise<UserTeamInfo> {
    return await this.personalGeneralService.teamInfo(root.userProfile.id);
  }

  @ResolveField((_returns) => [LevelRecord])
  async userLevelRecords(
    @Root() root: PersonalGeneralRoot,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.userLevelRecords(
      root.userProfile.id,
      root.beginAt,
    );
  }

  @ResolveField((_returns) => [LevelRecord])
  async promoLevelRecords(
    @Root() root: PersonalGeneralRoot,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.promoLevelRecords(root.beginAt);
  }

  @ResolveField((_returns) => [LevelRecord])
  async promoMemberLevelRecords(
    @Root() root: PersonalGeneralRoot,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.promoMemberLevelRecords(
      root.beginAt,
    );
  }

  // test 함수. 이후 진짜 test 파일로 분리해야 합니다.
  // @ResolveField((_returns) => String)
  // async characterTest() {
  //   await this.personalGeneralCharacterService.test();
  //   return 'asdf';
  // }

  @ResolveField((_returns) => Character, { nullable: true })
  async character(
    @Root() root: PersonalGeneralRoot,
  ): Promise<Character | null> {
    return await this.personalGeneralCharacterService.character(
      root.userProfile.id,
    );
  }

  @ResolveField((_returns) => [DailyActivity])
  async dailyActivities(
    @Root() root: PersonalGeneralRoot,
    @Args() { year }: GetDailyActivitiesArgs,
  ): Promise<DailyActivity[]> {
    const { start, end } = year
      ? this.dateRangeService.getAbsoluteDateRangeByYear(year)
      : this.dateRangeService.getRelativeDateRange();

    if (start.getFullYear() > DateWrapper.currYear().toDate().getFullYear()) {
      return [];
    }

    const cacheKey = `dailyActivities:${
      root.userProfile.id
    }:${start.getTime()}:${end.getTime()}`;

    const cached = await this.cacheUtilService.get<DailyActivity[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const dailyActivities =
      await this.dailyActiviyService.userDailyActivityByDate(
        root.userProfile.id,
        { start, end },
      );

    await this.cacheUtilService.set(cacheKey, dailyActivities);

    return dailyActivities;
  }

  @ResolveField((_returns) => [DailyActivityDetailRecordUnion])
  async dailyActivityDetailRecords(
    @Root() root: PersonalGeneralRoot,
    @Args()
    { args }: GetDailyActivityDetailRecordsArgs,
  ): Promise<(typeof DailyActivityDetailRecordUnion)[]> {
    const assertedArgs = args.map(({ id, type }) => {
      assertArgsIsDailyActivityDetailType(type);

      return { id, type };
    });

    // todo: id, type 별로 cache 를 관리하도록 수정해야 함
    const cacheKey = `dailyActivityDetailRecords:${args
      .sort((a, b) => (a.type === b.type ? a.id - b.id : a.type - b.type))
      .map(({ id, type }) => id.toString() + '-' + type.toString())
      .join(':')}`;

    const cached = await this.cacheUtilService.get<
      (typeof DailyActivityDetailRecordUnion)[]
    >(cacheKey);

    if (cached) {
      return cached;
    }

    const result =
      await this.dailyActiviyService.userDailyActivityDetailRecordsById(
        root.userProfile.id,
        assertedArgs,
      );

    await this.cacheUtilService.set(cacheKey, result);

    return result;
  }
}

function assertArgsIsDailyActivityDetailType(
  type: DailyActivityType,
): asserts type is Exclude<DailyActivityType, DailyActivityType.LOGTIME> {
  if (type === DailyActivityType.LOGTIME) {
    throw new BadRequestException('type must not be DailyActivityType.LOGTIME');
  }
}
