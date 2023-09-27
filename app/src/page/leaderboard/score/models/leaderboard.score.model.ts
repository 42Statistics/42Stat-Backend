import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardBase,
  LeaderboardElementDateRanged,
} from '../../common/models/leaderboard.model';

@ObjectType({ implements: () => LeaderboardBase })
export class LeaderboardScore {
  @Field({
    description: 'TOTAL, CURR_WEEK, CURR_MONTH 만 가능합니다',
  })
  byDateTemplate: LeaderboardElementDateRanged;
}
