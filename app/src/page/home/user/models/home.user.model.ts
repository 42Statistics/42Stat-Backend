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
export class UserCountPerLevel {
  @Field()
  userCount: number;

  @Field()
  level: number;
}

@ObjectType()
export class HomeUser {
  @Field((_type) => [IntRecord])
  activeUserCountRecords: IntRecord[];

  @Field((_type) => [UserCountPerLevel])
  userCountPerLevel: UserCountPerLevel[];

  @Field()
  memberRate: IntRate;

  @Field()
  blackholedRate: IntRate;

  @Field()
  blackholedCountByDateTemplate: IntDateRanged;

  @Field((_type) => [IntPerCircle])
  blackholedCountPerCircle: IntPerCircle[];

  @Field((_type) => [UserRanking])
  walletRanking: UserRanking[];

  @Field((_type) => [UserRanking])
  correctionPointRanking: UserRanking[];

  @Field((_type) => [IntPerCircle])
  averageDurationPerCircle: IntPerCircle[];
}
