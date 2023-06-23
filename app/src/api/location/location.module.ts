import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from 'src/cache/cache.module';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { LocationSchema, location } from './db/location.database.schema';
import { LocationCacheService } from './location.cache.service';
import { LocationService } from './location.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: location.name, schema: LocationSchema },
    ]),
    CursusUserModule,
    CacheModule,
  ],
  providers: [LocationService, LocationCacheService],
  exports: [
    MongooseModule,
    LocationService,
    LocationCacheService,
    CursusUserModule,
    CacheModule,
  ],
})
// eslint-disable-next-line
export class LocationModule {}
