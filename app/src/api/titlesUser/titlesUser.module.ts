import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TitlesUserSchema, titles_user } from './db/titlesUser.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: titles_user.name, schema: TitlesUserSchema },
    ]),
  ],
  providers: [],
  exports: [MongooseModule],
})
// eslint-disable-next-line
export class TitlesUserModule {}
