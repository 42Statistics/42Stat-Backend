import { Field, ObjectType } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { IntRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { ValueRecord } from '../../models/home.model';

@ObjectType()
export class ValuePerCircle {
  @Field()
  circle: number;

  @Field()
  value: number;
}

@ObjectType()
export class UserCountPerLevels {
  @Field()
  userCount: number;

  @Field()
  level: number;
}

@ObjectType()
export class HomeUser {
  @Field((_type) => [ValueRecord])
  activeUserCountRecords: ValueRecord[];

  @Field((_type) => [UserCountPerLevels])
  userCountPerLevels: UserCountPerLevels[];

  @Field()
  memberRate: IntRate;

  @Field()
  blackholedRate: IntRate;

  @Field()
  blackholedCountByDateTemplate: IntDateRanged;

  @Field((_type) => [ValuePerCircle])
  blackholedCountPerCircles: ValuePerCircle[];

  @Field((_type) => [UserRanking])
  walletRanks: UserRanking[];

  @Field((_type) => [UserRanking])
  correctionPointRanks: UserRanking[];

  @Field((_type) => [ValuePerCircle])
  averageCircleDurations: ValuePerCircle[];
}
