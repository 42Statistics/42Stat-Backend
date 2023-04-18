import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/common/models/common.coalition.model';
import { UserRanking } from 'src/common/models/common.user.model';

// todo: extends OmitType(project)
@ObjectType()
export class ProjectInfo {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field((_type) => [String], { nullable: 'items' })
  skills: string[];

  @Field()
  averagePassFinalmark: number;

  @Field()
  averageDurationTime: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  totalCloseCnt: number;

  @Field()
  currRegisteredCnt: number;

  @Field()
  passPercentage: number;

  @Field()
  totalEvalCnt: number;
}

@ObjectType()
export class ValueRecord {
  @Field()
  at: Date;

  @Field()
  value: number;
}

@ObjectType()
export class ValuePerCircle {
  @Field()
  circle: number;

  @Field()
  value: number;
}

@ObjectType()
export class TotalScore {
  @Field()
  coalition: Coalition;

  @Field()
  score: number;
}

@ObjectType()
export class ScoreRecords {
  @Field()
  coalition: Coalition;

  @Field((_type) => [ValueRecord])
  records: ValueRecord[];
}

@ObjectType()
export class UserCntPerPoint {
  @Field()
  userCnt: number;

  @Field()
  point: number;
}

@ObjectType()
export class EvalCntPerPoint {
  @Field()
  evalCnt: number;

  @Field()
  point: number;
}

@ObjectType()
export class UserCntPerLevel {
  @Field()
  userCnt: number;

  @Field()
  level: number;
}

@ObjectType()
export class Total {
  @Field((_type) => [ValueRecord])
  activeUserCntRecords: ValueRecord[];

  @Field((_type) => [ValuePerCircle])
  blackholedCntPerCircles: ValuePerCircle[];

  @Field((_type) => [UserRanking])
  correctionPointRanks: UserRanking[];

  @Field((_type) => [UserRanking])
  walletRanks: UserRanking[];

  @Field((_type) => [ValuePerCircle])
  averageCircleDurations: ValuePerCircle[];

  @Field((_type) => [UserCntPerLevel])
  userCntPerLevels: UserCntPerLevel[];
}
