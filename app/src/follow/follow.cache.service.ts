import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { FollowListCacheType } from './model/follow.model';

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
    list: FollowListCacheType[];
  }): Promise<void> {
    const key = `${id}:${type}:${FOLLOW_LISTS}`;

    console.log(`setting: ${key}`);

    await this.cacheUtilService.set(key, list, 0);
  }

  async get(
    userId: number,
    type: 'follower' | 'following',
  ): Promise<FollowListCacheType[]> {
    const key = `${userId}:${type}:${FOLLOW_LISTS}`;

    const cachedData = await this.cacheUtilService.get<FollowListCacheType[]>(
      key,
    );

    if (!cachedData) {
      return []; //todo: 흠,,,
    }

    return cachedData;
  }
}
