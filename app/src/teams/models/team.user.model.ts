import {
  Field,
  ID,
  IntersectionType,
  ObjectType,
  OmitType,
} from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class TeamUser {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field()
  isLeader: boolean;

  @Field()
  occurrence: number;

  @Field((_type) => ID)
  projectUserId: string;
}

// User와는 다른 타입을 제공함으로써 순환참조 제거
@ObjectType()
export class TeamUserPopulated extends IntersectionType(
  User,
  OmitType(TeamUser, ['id', 'login'] as const),
) {}
