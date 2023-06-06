import { Field, ObjectType } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { IntRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';

@ObjectType()
export class IntPerCircle {
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
  @Field((_type) => [IntRecord])
  activeUserCountRecords: IntRecord[];

  @Field((_type) => [UserCountPerLevels])
  userCountPerLevels: UserCountPerLevels[];

  @Field()
  memberRate: IntRate;

  @Field()
  blackholedRate: IntRate;

  @Field()
  blackholedCountByDateTemplate: IntDateRanged;

  @Field((_type) => [IntPerCircle])
  blackholedCountPerCircles: IntPerCircle[];

  @Field((_type) => [UserRanking])
  walletRanks: UserRanking[];

  @Field((_type) => [UserRanking])
  correctionPointRanks: UserRanking[];

  @Field((_type) => [IntPerCircle])
  averageCircleDurations: IntPerCircle[];
}
