import { Field, ObjectType } from '@nestjs/graphql';
import { Rate } from 'src/common/models/common.rate.model';
import { UserRank } from 'src/common/models/common.user.model';
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
  value: number;

  @Field()
  level: number;
}

@ObjectType()
export class HomeUser {
  @Field((_type) => [IntRecord])
  aliveUserCountRecords: IntRecord[];

  @Field((_type) => [UserCountPerLevel])
  userCountPerLevel: UserCountPerLevel[];

  @Field()
  memberRate: Rate;

  @Field()
  blackholedRate: Rate;

  @Field((_type) => [IntRecord])
  blackholedCountRecord: IntRecord[];

  @Field((_type) => [IntPerCircle])
  blackholedCountPerCircle: IntPerCircle[];

  @Field((_type) => [UserRank])
  walletRanking: UserRank[];

  @Field((_type) => [UserRank])
  correctionPointRanking: UserRank[];

  @Field((_type) => [IntPerCircle])
  averageDurationPerCircle: IntPerCircle[];
}
