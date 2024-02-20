import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { Follow } from './model/follow.model';

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
    list: Follow[];
  }): Promise<void> {
    const key = `${id}:${type}:${FOLLOW_LISTS}`;

    await this.cacheUtilService.set(key, list, 0);
  }

  async get(userId: number, type: 'follower' | 'following'): Promise<Follow[]> {
    const key = `${userId}:${type}:${FOLLOW_LISTS}`;

    const cachedData = await this.cacheUtilService.get<Follow[]>(key);

    if (!cachedData) {
      return []; //todo: 흠,,,
    }

    return cachedData;
  }
}
