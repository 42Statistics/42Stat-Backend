import { ObjectType, PickType } from '@nestjs/graphql';
import { TeamBase } from 'src/teams/models/team.base.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class ScaleTeamTeamPartial extends TeamBase {}

// todo: User 모듈 완성 후 교체해야함
@ObjectType()
export class ScaleTeamUserPartial extends PickType(User, ['id', 'login']) {}
