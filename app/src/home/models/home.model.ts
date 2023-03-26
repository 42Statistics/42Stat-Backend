import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectRanking, UserRanking } from './ranking.type';
import { ExamResult } from './examInfo.type';

@ObjectType()
export class Home {
  @Field((_type) => Int)
  currWeekEvalCnt: number;

  @Field((_type) => Int)
  lastWeekEvalCnt: number;

  @Field((_type) => Int)
  currMonthBlackholedCnt: number;

  @Field((_type) => Int)
  lastMonthBlackholedCnt: number; //todo: 기획에는 없지만 만들어둠

  @Field((_type) => [ProjectRanking])
  currRegisteredCntRank: [ProjectRanking];

  @Field((_type) => [UserRanking])
  monthlyExpIncrementRank: [UserRanking];

  @Field((_type) => [UserRanking])
  monthlyAccessTimeRank: [UserRanking];

  @Field((_type) => [UserRanking])
  totalEvalCntRank: [UserRanking];

  @Field((_type) => [UserRanking])
  levelRank: [UserRanking];

  @Field((_type) => [ExamResult])
  lastExamResult: [ExamResult];
}
