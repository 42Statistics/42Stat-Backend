import { Module } from '@nestjs/common';
import { CacheInMemoryService } from './cache.inMemory.service';

@Module({
  providers: [CacheInMemoryService],
  exports: [CacheInMemoryService],
})
// eslint-disable-next-line
export class CacheInMemoryModule {}
