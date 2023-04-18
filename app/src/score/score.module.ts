import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { score, ScoreSchema } from './db/score.database.schema';
import { ScoreService } from './score.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: score.name, schema: ScoreSchema }]),
  ],
  providers: [ScoreService],
  exports: [MongooseModule, ScoreService],
})
// eslint-disable-next-line
export class ScoreModule {}
