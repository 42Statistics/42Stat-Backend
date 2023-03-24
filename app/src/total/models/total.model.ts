import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  blackholedCircleType,
  durationDaybyCircleType,
  totalCoalitionScoreType,
  coalitionScoreChangeType,
  userCntByPointType,
  userCntByLevelType,
  evalCntByPointType,
  dateType,
} from './total.type';
import { RankingType } from 'src/home/models/ranking.type';

@ObjectType()
export class Total {
  @Field((_type) => [dateType])
  activeUserCnt: [dateType];

  @Field((_type) => [blackholedCircleType])
  blackholedCircle: [blackholedCircleType];

  @Field((_type) => [totalCoalitionScoreType])
  totalCoalitionScore: [totalCoalitionScoreType];

  @Field((_type) => [RankingType])
  evalPoint: [RankingType];

  @Field((_type) => [RankingType])
  wallet: [RankingType];

  @Field((_type) => [RankingType])
  monthlyCoalitionScore: [RankingType];

  @Field((_type) => Int)
  totalEvalCnt: number;

  @Field((_type) => Int)
  averageAllFeedbackLength: number;

  @Field((_type) => [durationDaybyCircleType])
  durationDaybyCircle: [durationDaybyCircleType];

  @Field((_type) => [coalitionScoreChangeType])
  coalitionScoreChange: [coalitionScoreChangeType];

  @Field((_type) => [userCntByPointType])
  userCntByPoint: [userCntByPointType];

  @Field((_type) => [evalCntByPointType])
  evalCntByPoint: [evalCntByPointType];

  @Field((_type) => [userCntByLevelType])
  userCntByLevel: [userCntByLevelType];
}
