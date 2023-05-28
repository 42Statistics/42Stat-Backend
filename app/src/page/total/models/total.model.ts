import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';

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
  totalCloseCount: number;

  @Field()
  currRegisteredCount: number;

  @Field()
  passPercentage: number;

  @Field()
  totalEvalCount: number;
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

//@ObjectType()
//export class ValuePerCircleByPromo {
//  @Field()
//  circle: number;

//  @Field()
//  value: number;

//  @Field()
//  promo: string;
//}

@ObjectType()
export class UserCountPerPoint {
  @Field()
  userCount: number;

  @Field()
  point: number;
}

@ObjectType()
export class UserCountPerLevels {
  @Field()
  userCount: number;

  @Field()
  level: number;
}

@ObjectType()
export class Total {
  @Field((_type) => ProjectInfo, { description: '' })
  projectInfo: ProjectInfo;

  @Field((_type) => UserRankingDateRanged, { description: ' ' })
  monthlyScoreRanks: UserRankingDateRanged;
}
