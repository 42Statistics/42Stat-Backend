import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CacheService,
  CacheSupportedDateTemplate,
  UserRankCache,
} from 'src/cache/cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserCacheService } from '../cursusUser/cursusUser.cache.service';
import { expIncreamentDateFilter } from './db/experiecneUser.database.aggregate';
import { ExperienceUserService } from './experienceUser.service';

export type ExpIncreamentRankingCacheSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

const EXP_INCREAMENT_RANKING = 'expIncRanking';

@Injectable()
export class ExperienceUserCacheService {
  constructor(
    private experienceUserService: ExperienceUserService,
    private cursusUserCacheService: CursusUserCacheService,
    private cacheService: CacheService,
  ) {}

  async getExpIncreamentRank(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheService.getRank(
      EXP_INCREAMENT_RANKING,
      dateTemplate,
      userId,
    );
  }

  async getExpIncreamentRanking(
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheService.getRanking(
      EXP_INCREAMENT_RANKING,
      dateTemplate,
    );
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  private async updateExperienceUser(): Promise<void> {
    console.debug('enter experienceUserCache at', new Date().toLocaleString());

    try {
      await this.updateExpIncreamentRanking();
    } catch (e) {
      console.error('ExpIncreamentRankingCache', e);
    }

    console.debug('leaving experienceUserCache', new Date().toLocaleString());
  }

  private async updateExpIncreamentRanking(): Promise<void> {
    await Promise.all([
      this.updateExpIncreamentRankingByDateTemplate(DateTemplate.CURR_MONTH),
      this.updateExpIncreamentRankingByDateTemplate(DateTemplate.CURR_WEEK),
    ]);
  }

  private updateExpIncreamentRankingByDateTemplate = async (
    dateTemplate: ExpIncreamentRankingCacheSupportedDateTemplate,
  ): Promise<void> => {
    await this.cacheService.updateRanking(
      EXP_INCREAMENT_RANKING,
      dateTemplate,
      async (dateRange) =>
        await this.experienceUserService.increamentRanking(
          expIncreamentDateFilter(dateRange),
        ),
      async () => {
        const userFullProfiles =
          await this.cursusUserCacheService.getAllUserFullProfile();

        assertExist(userFullProfiles);

        return [...userFullProfiles.values()];
      },
    );
  };
}
