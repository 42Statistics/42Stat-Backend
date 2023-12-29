import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { PaginationCursorModule } from 'src/pagination/cursor/pagination.cursor.module';
import { FollowSchema, follow } from './db/follow.database.schema';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: follow.name, schema: FollowSchema }]),
    CursusUserModule,
    PaginationCursorModule,
  ],
  providers: [FollowResolver, FollowService],
})
// eslint-disable-next-line
export class FollowModule {}
