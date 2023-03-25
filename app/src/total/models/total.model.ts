import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BlackholeCircle,
  DurationDayPerCircle,
  TotalScore,
  ScoreRecords,
  UserCntPerPoint,
  UserCntPerLevel,
  EvalCntPerPoint,
  Record,
} from './total.type';
import { Ranking } from 'src/home/models/ranking.type';

@ObjectType()
export class Total {
  @Field((_type) => [Record])
  activeUserCnt: [Record];

  @Field((_type) => [BlackholeCircle])
  blackholeCircle: [BlackholeCircle];

  @Field((_type) => [TotalScore])
  totalScore: [TotalScore];

  @Field((_type) => [Ranking])
  evalPointRank: [Ranking];

  @Field((_type) => [Ranking])
  walletRank: [Ranking];

  @Field((_type) => [Ranking])
  monthlyScoreRank: [Ranking];

  @Field((_type) => Int)
  totalEvalCnt: number;

  @Field((_type) => Int)
  averageFeedbackLength: number;

  @Field((_type) => [DurationDayPerCircle])
  durationDayPerCircle: [DurationDayPerCircle];

  @Field((_type) => [ScoreRecords])
  scoreRecords: [ScoreRecords];

  @Field((_type) => [UserCntPerPoint])
  userCntPerPoint: [UserCntPerPoint];

  @Field((_type) => [EvalCntPerPoint])
  evalCntPerPoint: [EvalCntPerPoint];

  @Field((_type) => [UserCntPerLevel])
  userCntPerLevel: [UserCntPerLevel];
}
