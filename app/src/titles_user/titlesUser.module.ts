import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TitlesUserSchema, titles_user } from './db/titlesUser.database.schema';
import { TitlesUserService } from './titlesUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: titles_user.name, schema: TitlesUserSchema },
    ]),
  ],
  providers: [TitlesUserService],
  exports: [MongooseModule, TitlesUserService],
})
// eslint-disable-next-line
export class TitlesUserModule {}
