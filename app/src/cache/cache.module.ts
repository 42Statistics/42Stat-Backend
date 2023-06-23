import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheInMemoryModule } from './inMemory/cache.inMemory.module';

@Module({
  imports: [CacheInMemoryModule],
  providers: [CacheService],
  exports: [CacheService, CacheInMemoryModule],
})
// eslint-disable-next-line
export class CacheModule {}
