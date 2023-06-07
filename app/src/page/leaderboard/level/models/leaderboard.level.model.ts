import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElement } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardLevel {
  // @Field((_type) => LeaderboardElement)
  @Field()
  total: LeaderboardElement;
}
