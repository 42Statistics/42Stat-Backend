import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActiveUserCountService } from './activeUserCount.service';
import { ActiveUserCountDao } from './db/activeUserCount.db.dao';
import {
  activeUserCountSchema,
  mv_active_user_counts,
} from './db/activeUserCount.db.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: mv_active_user_counts.name,
        schema: activeUserCountSchema,
      },
    ]),
  ],
  providers: [ActiveUserCountService, ActiveUserCountDao],
  exports: [ActiveUserCountService],
})
export class ActiveUserCountModule {}
