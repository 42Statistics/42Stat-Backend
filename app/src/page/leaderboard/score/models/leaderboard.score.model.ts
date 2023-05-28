import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardScore {
  @Field()
  total: LeaderboardElement;

  @Field()
  byDateRange: LeaderboardElementDateRanged;

  @Field()
  byDateTemplate: LeaderboardElementDateRanged;
}
