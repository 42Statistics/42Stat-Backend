import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardExp {
  @Field({ description: '주간 경험치 증가량 랭킹' })
  weekly: LeaderboardElementDateRanged;

  @Field({ description: '월간 경험치 증가량 랭킹' })
  monthly: LeaderboardElementDateRanged;
}
