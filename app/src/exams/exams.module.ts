import { Module } from '@nestjs/common';
import { ExamResolver } from './exam.resolver';
import { ExamsService } from './exams.service';

@Module({
  imports: [],
  exports: [],
  providers: [ExamResolver, ExamsService],
})
export class ExamsModule {}
