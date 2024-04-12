import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { feed } from './db/feed.database.schema';

@Injectable()
export class FeedCacheService {
  constructor(
    @InjectModel(feed.name)
    private readonly feedModel: Model<feed>,
    @Inject(CACHE_MANAGER)
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  /**
   * @description 매일 05:00에 최신 한달간의 피드를 캐싱한다. (ttl: 1일)
   * todo test: 1분 간격으로 cron 실행
   */
  @Cron('*/1 * * * *')
  async monthlyFeedCache() {
    const lastMonth = new DateWrapper().moveMonth(-1).toDate();

    const lastMonthFeeds = await this.feedModel.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $sort: { createdAt: -1 } },
      { $project: { _id: 0, __v: 0 } },
    ]);

    const key = `lastMonthFeeds`;

    await this.cacheUtilService.set(key, lastMonthFeeds, DateWrapper.DAY);
  }
}
