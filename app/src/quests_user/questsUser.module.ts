import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsUserSchema, quests_user } from './db/questsUser.database.schema';
import { QuestsUserService } from './questsUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: quests_user.name, schema: QuestsUserSchema },
    ]),
  ],
  providers: [QuestsUserService],
  exports: [MongooseModule, QuestsUserService],
})
// eslint-disable-next-line
export class QuestsUserModule {}
