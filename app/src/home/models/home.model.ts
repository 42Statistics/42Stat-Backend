import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LevelRankingType, ProjectRankingType, RankingType } from './ranking.type';
import { LastExamInfoType } from './examInfo.type';

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

  @Field((_type) => [ProjectRankingType])
  projectTeamCnt: [ProjectRankingType];

  @Field((_type) => [RankingType])
  monthlyExpIncrement: [RankingType];

  @Field((_type) => [RankingType])
  monthlyAccessTime: [RankingType];

  @Field((_type) => [RankingType])
  totalEvalCnt: [RankingType];

  @Field((_type) => [RankingType])
  level: [LevelRankingType];

  @Field((_type) => LastExamInfoType)
  lastExamPassRate: LastExamInfoType;
}
