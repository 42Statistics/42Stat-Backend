import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../common/models/leaderboard.model';

@ObjectType()
export class LeaderboardScore {
  @Field({
    description: 'TOTAL, CURR_WEEK, CURR_MONTH 만 가능합니다',
  })
  byDateTemplate: LeaderboardElementDateRanged;
}
