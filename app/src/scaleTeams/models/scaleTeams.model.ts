import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/teams/models/team.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class ScaleTeam {
  @Field((_type) => Int)
  id: number;

  @Field((_type) => Int)
  finalMark: number;

  @Field()
  beginAt: Date;

  @Field()
  filledAt: Date;

  @Field()
  flag: string; // todo: FlagType

  @Field((_type) => User)
  corrector: User;

  @Field((_type) => [User])
  corrected: User[];

  @Field((_type) => Team)
  team: Team;
}
