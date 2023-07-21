import type { CacheStore } from '@nestjs/cache-manager';
import type { Milliseconds } from 'cache-manager';
import { LRUCache } from 'lru-cache';
import { DateWrapper } from 'src/statDate/StatDate';

const clone = <T>(value: T): object => {
  if (typeof value === 'object') {
    return Object.create(
      Object.getPrototypeOf(value),
      Object.getOwnPropertyDescriptors(value),
    ) as object;
  }

  return value as object;
};

export class ShallowStore implements CacheStore {
  private readonly lruCache;
  private readonly lruOpts;

  constructor(args?: { max?: number; ttl?: Milliseconds }) {
    this.lruOpts = {
      ttlAutopurge: true,
      max: args?.max ?? 100000,
      ttl: args?.ttl ?? DateWrapper.MIN * 3,
    };

    this.lruCache = new LRUCache(this.lruOpts);
  }

  set = <T>(key: string, value: T, options?: number): Promise<void> => {
    if ((value ?? null) === null) {
      throw new Error('wrong cache value');
    }

    this.lruCache.set(key, clone(value), {
      ttl: options ?? this.lruOpts.ttl,
    });

    return Promise.resolve();
  };

  get = <T>(key: string): Promise<T | undefined> => {
    return Promise.resolve(this.lruCache.get(key) as T);
  };

  del = (key: string): Promise<void> => {
    this.lruCache.delete(key);
    return Promise.resolve();
  };
}
