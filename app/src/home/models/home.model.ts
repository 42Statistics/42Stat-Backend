import { Field, ObjectType } from '@nestjs/graphql';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserRanking } from 'src/common/models/common.user.model';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';
import { ProjectRanking } from 'src/project/models/project.ranking.model';

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
export class Home {
  @Field()
  currMonthBlackholedCount: NumberDateRanged;

  @Field()
  lastMonthBlackholedCount: NumberDateRanged;

  @Field((_type) => [ProjectRanking])
  currRegisteredCountRank: ProjectRanking[];

  @Field((_type) => [UserRanking])
  monthlyExpIncrementRank: UserRanking[];

  @Field((_type) => [UserRanking])
  monthlyAccessTimeRank: UserRanking[];

  @Field((_type) => [UserRanking])
  totalEvalCountRank: UserRanking[];

  @Field((_type) => [UserRanking])
  levelRank: UserRanking[];

  @Field()
  lastExamResult: ExamResultDateRanged;
}
