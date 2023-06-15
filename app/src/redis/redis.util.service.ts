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

  async replaceHash<T>(
    redisClient: RedisClientType,
    key: string,
    datas: T[],
    selector: (data: T) => number,
  ): Promise<void> {
    const tempkey = 'temp:' + key;

    await redisClient.hSet(
      tempkey,
      datas.map((data): [number, string] => [
        selector(data),
        JSON.stringify(data),
      ]),
    );

    await redisClient.rename(tempkey, key);
  }
}
