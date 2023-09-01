import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardComment {
  @Field({ description: 'Available DateTemplate=[TOTAL]' })
  byDateTemplate: LeaderboardElementDateRanged;
}
