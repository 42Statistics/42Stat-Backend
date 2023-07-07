import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheUtilModule } from 'src/cache/cache.util.module';
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
    CacheUtilModule,
  ],
  providers: [LocationService, LocationCacheService],
  exports: [
    MongooseModule,
    LocationService,
    LocationCacheService,
    CursusUserModule,
    CacheUtilModule,
  ],
})
// eslint-disable-next-line
export class LocationModule {}
