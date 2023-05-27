import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema, location } from './db/location.database.schema';
import { LocationService } from './location.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: location.name, schema: LocationSchema },
    ]),
  ],
  providers: [LocationService],
  exports: [MongooseModule, LocationService],
})
// eslint-disable-next-line
export class LocationModule {}
