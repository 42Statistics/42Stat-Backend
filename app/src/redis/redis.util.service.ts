import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisUtilService {
  async replaceKey(
    redisClient: RedisClientType,
    key: string,
    data: unknown,
  ): Promise<void> {
    const tempKey = 'temp:' + key;

    await redisClient.set(tempKey, JSON.stringify(data));
    await redisClient.rename(tempKey, key);
  }
}
