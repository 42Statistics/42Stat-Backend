import { Field, ObjectType } from '@nestjs/graphql';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';

@ObjectType()
export class Leaderboard {
  //todo: 기간 넣어서 구할 수 있도록 만들기

  // - 평가 횟수 랭킹
  @Field((_type) => [UserRanking], { description: '누적 평가 횟수 랭킹' })
  totalEvalCountRank: UserRanking[];

  @Field((_type) => UserRankingDateRanged, {
    description: '월간 평가 횟수 랭킹',
  })
  monthlyEvalCountRank: UserRankingDateRanged;

  @Field((_type) => UserRankingDateRanged, {
    description: '주간 평가 횟수 랭킹',
  })
  weeklyEvalCountRank: UserRankingDateRanged;

  // - 레벨 랭킹
  @Field((_type) => UserRankingDateRanged, { description: '누적 레벨 랭킹' })
  levelRank: UserRankingDateRanged;

  // - 경험치 증가량 랭킹
  @Field((_type) => [UserRanking], { description: '월간 경험치 증가량 랭킹' })
  monthlyExpIncrementRank: UserRanking[];

  @Field((_type) => [UserRanking], { description: '주간 경험치 증가량 랭킹' })
  weeklyExpIncrementRank: UserRanking[];

  //   - 코알리숑 스코어 렝킹
  @Field((_type) => [UserRanking], {
    description: '누적 코알리숑 스코어 기여 랭킹',
  })
  totalScoreRank: UserRanking[];

  @Field((_type) => [UserRanking], {
    description: '월간 코알리숑 스코어 기여 랭킹',
  })
  monthlyScoreRank: UserRanking[];

  @Field((_type) => [UserRanking], {
    description: '주간 코알리숑 스코어 기여 랭킹',
  })
  weeklyScoreRank: UserRanking[];
}
