import { SetMetadata } from '@nestjs/common';
import { DateWrapper } from 'src/statDate/StatDate';

const DEFAULT_CACHE_TIME = DateWrapper.MIN * 3;

export const ONRETURN = Symbol('ONRETURN');
export const CacheOnReturn = (ttl: number = DEFAULT_CACHE_TIME) =>
  SetMetadata(ONRETURN, ttl);
