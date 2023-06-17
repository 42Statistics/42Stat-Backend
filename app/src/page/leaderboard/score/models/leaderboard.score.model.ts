import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardScore {
  @Field({
    description: 'Available DateTemplate=[TOTAL, CURR_WEEK, CURR_MONTH]',
  })
  byDateTemplate: LeaderboardElementDateRanged;
}
