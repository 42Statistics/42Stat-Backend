import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/teams/models/team.model';
import { UserProject } from './user.project.model';
import { UserTitle } from './user.title.model';

@ObjectType({ description: 'single User model' })
export class User {
  @Field((_type) => Int)
  id: number;

  @Field()
  login: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field()
  grade: string;

  @Field((_type) => Float) // todo: cursus user? or Enum arg of cursus id
  level: number;

  // 언젠가 피신 정보를 제공한다면, level과 묶어서 cursus_users 개념 도입해야 함.
  @Field((_type) => String)
  beginAt: string;

  @Field({ nullable: true })
  blackholedAt: string;

  @Field((_type) => Int)
  wallet: number;

  @Field((_type) => Int)
  correctionPoint: number;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => [UserProject], { nullable: 'items' })
  projects: UserProject[];

  // @Field((_type) => Int) // todo: evaluation users object type
  // totalCount: number;

  // @Field()
  // coalitionScore: number; // todo: coalition rank user object type

  // @Field()
  // subjects: string; // todo: subject array, with args sort, length

  // @Field()
  // coalition: string; // todo: coaliton object type
}
