import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardFloatElement } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardLevel {
  @Field((_type) => LeaderboardFloatElement)
  total: LeaderboardFloatElement;
}
