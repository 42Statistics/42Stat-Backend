import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';
import {
  UserRank,
  UserRankingIndexPaginated,
} from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import { Promo } from 'src/page/common/models/promo.model';

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
