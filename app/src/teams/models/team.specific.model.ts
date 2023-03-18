import {
  Field,
  ID,
  IntersectionType,
  ObjectType,
  OmitType,
} from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class TeamUserSpecific {
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

// todo: 이 타입을 유저에서 정의하도록 하고, 간접 순환참조까지 제거해야함
// User와는 다른 타입을 제공함으로써 순환참조 제거
@ObjectType()
export class TeamUserPopulated extends IntersectionType(
  User,
  OmitType(TeamUserSpecific, ['id', 'login'] as const),
) {}
