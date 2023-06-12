import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisUtilService {
  async replaceKey<T>(
    redisClient: RedisClientType,
    key: string,
    datas: T[],
  ): Promise<void> {
    const tempKey = 'temp:' + key;

    await redisClient.set(tempKey, JSON.stringify(datas));
    await redisClient.rename(tempKey, key);
  }
}
