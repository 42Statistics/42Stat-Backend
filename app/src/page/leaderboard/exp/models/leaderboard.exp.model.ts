import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardExp {
  @Field({ description: 'Available DateTemplate=[CURR_MONTH, CURR_WEEK]' })
  byDateTemplate: LeaderboardElementDateRanged;
}
