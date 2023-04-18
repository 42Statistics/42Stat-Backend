import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/project/models/project.preview';

@ObjectType()
export class ProjectRanking {
  @Field((_type) => ProjectPreview)
  projectPreview: ProjectPreview;

  @Field((_type) => Int)
  value: number;
}
