import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, Max, Min, NotEquals } from 'class-validator';
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
  // todo: api version header 를 받는 등의 방식을 사용하면 기존 field 명으로 처리할 수 있습니다만,
  // 프론트엔드가 현재 작업을 할 수 없는 상황이기 때문에 이렇게 처리합니다.
  @Field((_type) => [IntRecord])
  monthlyAliveUserCountRecordsFromStart: IntRecord[];

  @Field((_type) => [IntRecord])
  monthlyAliveUserCountRecordsFromEnd: IntRecord[];

  @Field((_type) => [IntRecord])
  monthlyAliveUserCountRecordsByDate: IntRecord[];

  @Field((_type) => [IntRecord])
  monthlyActiveUserCountRecordsFromEnd: IntRecord[];

  @Field((_type) => [IntRecord], { deprecationReason: 'v0.10.0' })
  aliveUserCountRecords: IntRecord[];

  @Field((_type) => [UserCountPerLevel])
  userCountPerLevel: UserCountPerLevel[];

  @Field()
  userRate: Rate;

  @Field()
  memberRate: Rate;

  @Field()
  blackholedRate: Rate;

  @Field((_type) => [IntRecord], { description: '1 ~ 120 개월' })
  blackholedCountRecords: IntRecord[];

  @Field((_type) => [IntPerCircle])
  blackholedCountPerCircle: IntPerCircle[];

  @Field((_type) => [UserRank])
  walletRanking: UserRank[];

  @Field((_type) => [UserRank])
  correctionPointRanking: UserRank[];

  @Field((_type) => [IntPerCircle])
  averageDurationPerCircle: IntPerCircle[];
}

@ArgsType()
export class GetHomeUserAliveUserCountRecordsFromStartArgs {
  @Min(1)
  // todo: 2031 년부터 가져올 수 없습니다
  @Max(120)
  @Field()
  first: number;
}

@ArgsType()
export class GetHomeUserAliveUserCountRecordsFromEndArgs {
  @Min(1)
  @Max(120)
  @Field()
  last: number;
}

@ArgsType()
export class GetHomeUserAliveUserCountRecordsByDateArgs {
  @Min(-120)
  @Max(120)
  @NotEquals(0)
  @Field()
  firstOrLast: number;

  @IsNumber()
  @Field()
  timestamp: number;
}

@ArgsType()
export class GetHomeUserMonthlyActiveUserCountRecordsFromEndArgs {
  @Min(1)
  @Max(120)
  @Field()
  last: number;
}

@ArgsType()
export class GetHomeUserBlackholedCountRecordsArgs {
  @Min(1)
  @Max(120)
  @Field()
  last: number;
}
