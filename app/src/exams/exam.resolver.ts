import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ExamsService } from './exams.service';
import { Exam } from './models/exam.model';

@Resolver((_of: unknown) => Exam)
export class ExamResolver {
  constructor(private readonly examsService: ExamsService) {}

  @Query((_returns) => Exam)
  async exam(@Args('id', { type: () => Int }) id: number) {
    return await this.examsService.findById(id);
  }
}
