import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { FollowSchema, follow } from './db/follow.database.schema';
import { FollowResolver } from './follow.resolve';
import { FollowService } from './follow.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: follow.name, schema: FollowSchema }]),
    CursusUserModule,
  ],
  providers: [FollowResolver, FollowService],
})
// eslint-disable-next-line
export class FollowModule {}
