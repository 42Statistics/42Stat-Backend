import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardScore {
  @Field({ description: '주간 코알리숑 스코어 기여 랭킹' })
  weeklyScoreRank: LeaderboardElementDateRanged;

  @Field({ description: '월간 코알리숑 스코어 기여 랭킹' })
  monthlyScoreRank: LeaderboardElementDateRanged;

  @Field({ description: '누적 코알리숑 스코어 기여 랭킹' })
  totalScoreRank: LeaderboardElement;
}
