import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { promosUserSchema, promos_user } from './db/promosUser.database.schema';
import { PromosUserService } from './promosUser.sevice';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: promosUserSchema, name: promos_user.name },
    ]),
  ],
  providers: [PromosUserService],
})
// eslint-disable-next-line
export class PromosUserModule {}
