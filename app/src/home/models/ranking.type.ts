import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class UserPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field((_type) => URLResolver)
  imgUrl: string;
}

@ObjectType()
export class ProjectPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class UserRanking {
  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field((_type) => Float)
  value: number;
}

@ObjectType()
export class ProjectRanking {
  @Field((_type) => ProjectPreview)
  projectPreview: ProjectPreview;

  @Field((_type) => Int)
  value: number;
}
