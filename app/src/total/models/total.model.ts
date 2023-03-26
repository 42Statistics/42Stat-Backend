import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRanking } from 'src/home/models/ranking.type';
import {
  Record,
  ValuePerCircle,
  TotalScore,
  ScoreRecords,
  UserCntPerPoint,
  UserCntPerLevel,
  EvalCntPerPoint,
} from './total.type';

@ObjectType()
export class Total {
  @Field((_type) => [Record])
  activeUserCntRecords: [Record];

  @Field((_type) => [ValuePerCircle])
  blackholedCntPerCircles: [ValuePerCircle];

  @Field((_type) => [TotalScore])
  totalScores: [TotalScore];

  @Field((_type) => [UserRanking])
  evalPointRanks: [UserRanking];

  @Field((_type) => [UserRanking])
  walletRanks: [UserRanking];

  @Field((_type) => [UserRanking])
  monthlyScoreRanks: [UserRanking];

  @Field()
  totalEvalCnt: number;

  @Field()
  averageFeedbackLength: number;

  @Field((_type) => [ValuePerCircle])
  averageCircleDurations: [ValuePerCircle];

  @Field((_type) => [ScoreRecords])
  scoreRecords: [ScoreRecords];

  @Field((_type) => [UserCntPerPoint])
  userCntPerPoints: [UserCntPerPoint];

  @Field((_type) => [EvalCntPerPoint])
  evalCntPerPoints: [EvalCntPerPoint];

  @Field((_type) => [UserCntPerLevel])
  userCntPerLevels: [UserCntPerLevel];
}
