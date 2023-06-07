import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardEval {
  // @Field((_type) => LeaderboardElement)
  @Field()
  total: LeaderboardElement;

  // @Field((_type) => LeaderboardElementDateRanged)
  @Field()
  byDateTemplate: LeaderboardElementDateRanged;
}
