import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { UserPreview } from 'src/common/models/common.user.model';
import type { UserFullProfile } from 'src/common/userFullProfile';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';

const USER_FULL_PROFILE = 'userFullProfile';

export type CacheWithDate<T> = {
  data: T;
  updatedAt: Date;
};

export type UserFullProfileMap = Map<UserPreview['id'], UserFullProfile>;

@Injectable()
export class CacheUtilService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async getWithoutDate<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager
      .get<CacheWithDate<T>>(key)
      .then((res) => res?.data);
  }

  async set(key: string, data: unknown): Promise<void> {
    await this.cacheManager.set(key, data);
  }

  async setWithDate<T>(
    key: string,
    data: T,
    updatedAt: Date,
    ttl?: number,
  ): Promise<void> {
    await this.cacheManager.set(
      key,
      { data, updatedAt },
      ttl ?? DateWrapper.DAY * 15,
    );
  }

  private async getMap<K, V>(key: string): Promise<Map<K, V> | undefined> {
    return await this.getWithoutDate<Map<K, V>>(key);
  }

  async getMapValue<K, V>(key: string, elemKey: K): Promise<V | undefined> {
    return await this.getMap<K, V>(key).then((map) => map?.get(elemKey));
  }

  async getMapValues<V>(key: string): Promise<V[] | undefined> {
    return await this.getMap<unknown, V>(key).then((map) =>
      map ? [...map.values()] : undefined,
    );
  }

  async getUserFullProfile(
    userId: number,
  ): Promise<UserFullProfile | undefined> {
    return await this.getMapValue<number, UserFullProfile>(
      USER_FULL_PROFILE,
      userId,
    );
  }

  async getUserFullProfiles(): Promise<UserFullProfile[] | undefined> {
    return await this.getMapValues(USER_FULL_PROFILE);
  }

  async getUserFullProfileMap(): Promise<UserFullProfileMap | undefined> {
    return this.getWithoutDate<UserFullProfileMap>(USER_FULL_PROFILE);
  }

  async setUserFullProfiles(
    userFullProfiles: UserFullProfile[],
    updatedAt: Date,
  ): Promise<void> {
    const userFullProfileMap: UserFullProfileMap = new Map();

    userFullProfiles.map((userFullProfile) => {
      userFullProfileMap.set(
        userFullProfile.cursusUser.user.id,
        userFullProfile,
      );
    });

    await this.setWithDate(USER_FULL_PROFILE, userFullProfileMap, updatedAt);
  }

  buildKey(...args: string[]): string {
    return args.join(':');
  }
}
