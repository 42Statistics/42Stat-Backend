import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class ProjectRanking {
  @Field((_type) => ProjectPreview)
  projectPreview: ProjectPreview;

  @Field((_type) => Int)
  value: number;
}
