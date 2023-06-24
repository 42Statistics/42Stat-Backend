import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CacheService,
  CacheSupportedDateTemplate,
} from 'src/cache/cache.service';
import { assertExist } from 'src/common/assertExist';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserCacheService } from '../cursusUser/cursusUser.cache.service';
import { LocationService } from './location.service';

const LOGTIME_RANKING = 'logtimeRanking';

@Injectable()
export class LocationCacheService {
  constructor(
    private locationService: LocationService,
    private cacheService: CacheService,
    private cursusUserCacheService: CursusUserCacheService,
  ) {}

  async getLogtimeRankingCacheByDateTemplate(
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<UserRank[] | undefined> {
    return await this.cacheService.getRanking(LOGTIME_RANKING, dateTemplate);
  }

  // todo: 간격 조절
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateLocationCache(): Promise<void> {
    console.debug('enter locationCache', new Date());

    try {
      await this.updateLogtimeRanking();
    } catch (e) {
      console.error('updateLocationCache', e);
    }

    console.debug('leaving locationCache', new Date());
  }

  async updateLogtimeRanking(): Promise<void> {
    await Promise.all([
      this.updateLogtimeRankingByDateTemplate(DateTemplate.TOTAL),
      this.updateLogtimeRankingByDateTemplate(DateTemplate.CURR_MONTH),
      this.updateLogtimeRankingByDateTemplate(DateTemplate.LAST_MONTH),
    ]);
  }

  private updateLogtimeRankingByDateTemplate = async (
    dateTemplate: CacheSupportedDateTemplate,
  ): Promise<void> => {
    await this.cacheService.updateRanking(
      LOGTIME_RANKING,
      dateTemplate,
      async (dateRange: DateRange) =>
        await this.locationService.logtimePerUserByDateRange(dateRange),
      async () => {
        const userFullProfiles =
          await this.cursusUserCacheService.getAllUserFullProfileCache();

        assertExist(userFullProfiles);

        return userFullProfiles.map(({ cursusUser }) => ({
          id: cursusUser.user.id,
          login: cursusUser.user.login,
          imgUrl: cursusUser.user.image.link,
        }));
      },
    );
  };
}
