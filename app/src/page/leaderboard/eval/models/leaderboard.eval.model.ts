import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardEval {
  @Field((_type) => LeaderboardElement)
  total: LeaderboardElement;

  @Field((_type) => LeaderboardElementDateRanged)
  byDateTemplate: LeaderboardElementDateRanged;
}
