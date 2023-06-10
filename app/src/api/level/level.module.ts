import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelSchema, level } from './db/level.database.schema';
import { LevelService } from './level.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: level.name, schema: LevelSchema }]),
  ],
  providers: [LevelService],
  exports: [MongooseModule, LevelService],
})
// eslint-disable-next-line
export class LevelModule {}
