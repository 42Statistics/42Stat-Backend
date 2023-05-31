import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardExp {
  @Field()
  byDateRange: LeaderboardElementDateRanged;

  @Field()
  byDateTemplate: LeaderboardElementDateRanged;
}