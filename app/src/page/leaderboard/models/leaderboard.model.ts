import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserRanking } from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class LeaderboardRanking extends OmitType(UserRanking, ['rank']) {
  @Field()
  rank: number;
}

@ObjectType()
export class LeaderboardElement {
  @Field({ description: '내 랭킹 정보', nullable: true })
  me?: LeaderboardRanking;

  @Field((_type) => [LeaderboardRanking], { description: '전체 랭킹 정보' })
  totalRanks: LeaderboardRanking[];
}

@ObjectType()
export class LeaderboardElementDateRanged extends DateRanged(
  LeaderboardElement,
) {}
