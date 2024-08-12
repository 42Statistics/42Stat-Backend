import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { CampusUserService } from './campusUser.service';
import { CampusUserDao } from './db/campusUser.db.dao';
import { campus_user, CampusUserSchema } from './db/campusUser.db.schema';

@Module({
  imports: [
    CacheUtilModule,
    MongooseModule.forFeature([
      { name: campus_user.name, schema: CampusUserSchema },
    ]),
  ],
  providers: [CampusUserDao, CampusUserService],
  exports: [MongooseModule, CampusUserService],
})
// eslint-disable-next-line
export class CampusUserModule {}
