import { Field, ObjectType } from '@nestjs/graphql';
import { UserRanking } from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class LeaderboardElement {
  @Field({ description: '내 랭킹 정보', nullable: true })
  me?: UserRanking;

  @Field((_type) => [UserRanking], { description: '전체 랭킹 정보' })
  totalRanks: UserRanking[];
}

@ObjectType()
export class LeaderboardElementDateRanged extends DateRanged(
  LeaderboardElement,
) {}
