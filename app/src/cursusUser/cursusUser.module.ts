import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserResolver } from './cursusUser.resolver';
import { CursusUserService } from './cursusUser.service';
import { CursusUserSchema, cursus_user } from './db/cursusUser.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: cursus_user.name, schema: CursusUserSchema },
    ]),
  ],
  providers: [CursusUserService, CursusUserResolver],
  exports: [MongooseModule, CursusUserService],
})
// eslint-disable-next-line
export class CursusUserModule {}
