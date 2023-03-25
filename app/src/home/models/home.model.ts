import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectRanking, Ranking } from './ranking.type';
import { LastExamInfo } from './examInfo.type';

@ObjectType()
export class Home {
  @Field((_type) => Int)
  currWeekEvalCnt: number;

  @Field((_type) => Int)
  lastWeekEvalCnt: number;

  @Field((_type) => Int)
  lastMonthBlackholedCnt: number; //todo: 기획에는 없지만 만들어둠

  @Field((_type) => Int)
  currMonthBlackholedCnt: number;

  @Field((_type) => [ProjectRanking])
  currRegisteredCntRank: [ProjectRanking];

  @Field((_type) => [Ranking])
  monthlyExpIncrementRank: [Ranking];

  @Field((_type) => [Ranking])
  monthlyAccessTimeRank: [Ranking];

  @Field((_type) => [Ranking])
  totalEvalCntRank: [Ranking];

  @Field((_type) => [Ranking])
  levelRank: [Ranking];

  @Field((_type) => [LastExamInfo])
  lastExamPassRate: [LastExamInfo];
}
