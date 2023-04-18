import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class ProjectPreview {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;
}

@ObjectType()
export class ProjectRanking {
  @Field((_type) => ProjectPreview)
  projectPreview: ProjectPreview;

  @Field((_type) => Int)
  value: number;
}
