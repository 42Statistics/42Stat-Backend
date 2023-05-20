import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoalitionSchema } from 'src/coalition/db/coalition.database.schema';
import { CoalitionsUserService } from './coalitionsUser.service';
import { coalitions_user } from './db/coalitionsUser.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: coalitions_user.name, schema: CoalitionSchema },
    ]),
  ],
  providers: [CoalitionsUserService],
  exports: [MongooseModule, CoalitionsUserService],
})
// eslint-disable-next-line
export class CoalitionsUserModule {}
