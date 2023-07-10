import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { ONRETURN } from './cache.decorator.onReturn.symbol';

@Injectable()
export class CacheDecoratorOnReturnRegister implements OnModuleInit {
  constructor(
    private discoveryService: DiscoveryService,
    private metadataScanner: MetadataScanner,
    private reflactor: Reflector,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  onModuleInit() {
    return this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        this.metadataScanner
          .getAllMethodNames(Object.getPrototypeOf(instance))
          .forEach((methodName) => {
            const ttl = this.reflactor.get(ONRETURN, instance[methodName]);
            if (!ttl) {
              return;
            }

            const methodRef = instance[methodName];

            instance[methodName] = async (...args: any[]) => {
              const cacheKey = ['onReturn', methodName, ...args].join(':');
              const cached = await this.cacheManager.get(cacheKey);

              if (cached) {
                return cached;
              }

              const result = await methodRef.call(instance, ...args);

              await this.cacheManager.set(cacheKey, result, ttl);

              return result;
            };
          });
      });
  }
}
