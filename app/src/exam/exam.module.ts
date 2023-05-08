import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSchema, exam } from './db/exam.database.schema';
import { ExamService } from './exam.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: exam.name, schema: ExamSchema }]),
  ],
  providers: [ExamService],
  exports: [MongooseModule, ExamService],
})
// eslint-disable-next-line
export class ExamModule {}
