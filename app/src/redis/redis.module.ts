import { Module, Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisUtilService } from './redis.util.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const redisClient = createClient({
      url: 'redis://redis:6379',
    });

    redisClient.on('error', (err) => {
      throw err;
    });

    await redisClient.connect();

    return redisClient;
  },
};

@Module({
  providers: [RedisProvider, RedisUtilService],
  exports: [RedisProvider, RedisUtilService],
})
// eslint-disable-next-line
export class RedisModule {}
