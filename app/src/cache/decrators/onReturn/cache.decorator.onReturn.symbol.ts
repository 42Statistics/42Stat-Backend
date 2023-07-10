import { SetMetadata } from '@nestjs/common';
import { StatDate } from 'src/statDate/StatDate';

const DEFAULT_CACHE_TIME = StatDate.MIN * 2;

export const ONRETURN = Symbol('ONRETURN');
export const CacheOnReturn = (ttl: number = DEFAULT_CACHE_TIME) =>
  SetMetadata(ONRETURN, ttl);
