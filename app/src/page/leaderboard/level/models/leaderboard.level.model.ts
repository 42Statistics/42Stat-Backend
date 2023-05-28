import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElement } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardLevel {
  @Field()
  total: LeaderboardElement;
}
