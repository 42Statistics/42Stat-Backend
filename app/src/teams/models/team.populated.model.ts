import { ObjectType, OmitType } from '@nestjs/graphql';
import { Team } from './team.model';

@ObjectType()
export class TeamPopulated extends OmitType(Team, [
  'usersPopulated',
  'projectPopulated',
]) {}
