import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, user } from './db/user.database.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: user.name }]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
// eslint-disable-next-line
export class UserModule {}
