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

@InterfaceType()
export abstract class LeaderboardBase {
  @Field((_type) => [Promo], { description: '기수 정보' })
  promoList: Promo[];

  // coalition 분류 같은거 넣으면 좋을 듯
}
