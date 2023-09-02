import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardExp {
  @Field({ description: 'CURR_MONTH, CURR_WEEK 만 가능합니다' })
  byDateTemplate: LeaderboardElementDateRanged;
}
