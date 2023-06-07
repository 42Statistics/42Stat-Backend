import { Field, Float, ObjectType, OmitType } from '@nestjs/graphql';
import { UserRanking } from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';

@ObjectType()
export class LeaderboardRanking extends OmitType(UserRanking, [
  'value',
  'rank',
]) {
  @Field()
  value: number;

  @Field()
  rank: number;
}

@ObjectType()
export class LeaderboardFloatRanking extends OmitType(UserRanking, [
  'value',
  'rank',
]) {
  @Field((_type) => Float)
  value: number;

  @Field()
  rank: number;
}

@ObjectType()
export class LeaderboardRankingPaginated extends IndexPaginated(
  LeaderboardRanking,
) {}

@ObjectType()
export class LeaderboardFloatRankingPaginated extends IndexPaginated(
  LeaderboardFloatRanking,
) {}

@ObjectType()
export class LeaderboardElement {
  @Field({ description: '내 랭킹 정보', nullable: true })
  me?: LeaderboardRanking;

  @Field({ description: '전체 랭킹 정보' })
  totalRanks: LeaderboardRankingPaginated;
}

@ObjectType()
export class LeaderboardFloatElement {
  @Field({ description: '내 랭킹 정보', nullable: true })
  me?: LeaderboardFloatRanking;

  @Field({ description: '전체 랭킹 정보' })
  totalRanks: LeaderboardFloatRankingPaginated;
}

@ObjectType()
export class LeaderboardElementDateRanged extends DateRanged(
  LeaderboardElement,
) {}
