import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardEval {
  @Field({
    description: 'Available DateTemplate=[TOTAL, CURR_MONTH, CURR_WEEK]',
  })
  byDateTemplate: LeaderboardElementDateRanged;
}
