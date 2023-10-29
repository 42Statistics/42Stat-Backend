import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/page/common/models/coalition.model';

@ObjectType()
export class UserTitle {
  @Field()
  titleId: number;

  @Field()
  name: string;

  @Field()
  selected: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UserProfile {
  @Field()
  id: number;

  @Field()
  login: string;

  @Field({ nullable: true })
  imgUrl?: string;

  @Field()
  grade: string;

  @Field()
  displayname: string;

  @Field({ nullable: true })
  coalition?: Coalition;

  @Field((_type) => [UserTitle])
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;
}
