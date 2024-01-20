import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { FollowList } from './model/follow.model';

export const FOLLOW_LISTS = 'followLists';

@Injectable()
export class FollowCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  async set({
    id,
    type,
    list,
  }: {
    id: number;
    type: 'follower' | 'following';
    list: FollowList[];
  }): Promise<void> {
    const key = `${id}:${type}:${FOLLOW_LISTS}`;

    console.log(`setting: ${key}`);

    await this.cacheUtilService.set(key, list);
  }

  async get(
    userId: number,
    type: 'follower' | 'following',
  ): Promise<FollowList[] | undefined> {
    const key = `${userId}:${type}:${FOLLOW_LISTS}`;

    const cachedData = await this.cacheUtilService.get<FollowList[]>(key);

    if (!cachedData) {
      return undefined;
    }

    return cachedData;
  }

  //updateCacheValue(key, data); //: 주어진 키에 해당하는 캐시 값을 업데이트합니다.
}
