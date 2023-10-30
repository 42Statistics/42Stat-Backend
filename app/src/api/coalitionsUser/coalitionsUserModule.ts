import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CoalitionsUserSchema,
  coalitions_user,
} from './db/coalitionsUser.database.schema';
import { CoalitionsUserService } from './coalitionsUserService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: coalitions_user.name, schema: CoalitionsUserSchema },
    ]),
  ],
  providers: [CoalitionsUserService],
  exports: [CoalitionsUserService, MongooseModule],
})
// eslint-disable-next-line
export class CoalitionsUserModule {}
