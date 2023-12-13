import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema, follow } from './db/follow.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: follow.name, schema: FollowSchema }]),
  ],
  providers: [],
  exports: [],
})
export class FollowModule {}
