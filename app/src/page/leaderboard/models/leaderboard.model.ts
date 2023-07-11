import { Field, ObjectType } from '@nestjs/graphql';
import {
  UserRank,
  UserRankingIndexPaginated,
} from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

// 나중에 기수, 코알리숑 별 랭킹 하게 된다면... RankType extends UserRank = UserRank
// 이런 방법도 가능할듯.

@ObjectType()
export class LeaderboardElement {
  @Field({ description: '내 랭킹 정보', nullable: true })
  me?: UserRank;

  @Field({ description: '전체 랭킹 정보' })
  totalRanking: UserRankingIndexPaginated;
}

@ObjectType()
export class LeaderboardElementDateRanged extends DateRanged(
  LeaderboardElement,
) {}
