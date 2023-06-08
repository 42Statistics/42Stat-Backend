import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/api/project/models/project.preview';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class ProjectRanking {
  @Field()
  projectPreview: ProjectPreview;

  @Field()
  value: number;
}

@ObjectType()
export class ExamResult {
  @Field()
  rank: number;

  @Field()
  passCount: number;

  @Field()
  totalCount: number;
}

@ObjectType()
export class ExamResultDateRanged extends ArrayDateRanged(ExamResult) {}

@ObjectType()
export class HomeTeam {
  @Field((_type) => [ProjectRanking])
  currRegisteredCountRanking: ProjectRanking[];

  @Field({ description: 'HOME 직전 회차 시험 Rank별 통과율' })
  lastExamResult: ExamResultDateRanged;
}
