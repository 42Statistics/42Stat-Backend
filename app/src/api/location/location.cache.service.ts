import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CacheService,
  CacheSupportedDateTemplate,
} from 'src/cache/cache.service';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserCacheService } from '../cursusUser/cursusUser.cache.service';
import { LocationService } from './location.service';

const LOCATION_RANKING = 'locationRanking';

@Injectable()
export class LocationCacheService {
  constructor(
    private locationService: LocationService,
    private cacheService: CacheService,
    private cursusUserCacheService: CursusUserCacheService,
  ) {}

  async getLocationRankingCacheByDateTemplate(
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<UserRank[] | undefined> {
    return await this.cacheService.getRanking(LOCATION_RANKING, dateTemplate);
  }

  // todo: 간격 조절
  @Cron(CronExpression.EVERY_MINUTE)
  async updateLocationCache(): Promise<void> {
    console.debug('enter locationCache', new Date());

    try {
      await this.updateLocationRanking();
    } catch (e) {
      console.error('updateLocationCache', e);
    }

    console.debug('leaving locationCache', new Date());
  }

  async updateLocationRanking(): Promise<void> {
    await Promise.all([
      this.updateLocationRankingByDateTemplate(DateTemplate.TOTAL),
      this.updateLocationRankingByDateTemplate(DateTemplate.CURR_MONTH),
      this.updateLocationRankingByDateTemplate(DateTemplate.LAST_MONTH),
    ]);
  }

  private updateLocationRankingByDateTemplate = async (
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<void> => {
    await this.cacheService.updateRanking(
      LOCATION_RANKING,
      dateTemplate,
      async (dateRange: DateRange) =>
        await this.locationService.logtimeByDateRange(dateRange),
      async () => {
        const userFullProfiles =
          await this.cursusUserCacheService.getAllUserFullProfileCache();

        return userFullProfiles!.map(({ cursusUser }) => ({
          id: cursusUser.user.id,
          login: cursusUser.user.login,
          imgUrl: cursusUser.user.image.link,
        }));
      },
    );
  };
}
