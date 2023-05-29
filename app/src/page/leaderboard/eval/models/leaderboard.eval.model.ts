import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardEval {
  @Field({ description: '주간 평가 횟수 랭킹' })
  weekly: LeaderboardElementDateRanged;

  @Field({ description: '월간 평가 횟수 랭킹' })
  monthly: LeaderboardElementDateRanged;

  @Field({ description: '누적 평가 횟수 랭킹' })
  total: LeaderboardElement;
}
