import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/project/models/project.preview';

@ObjectType()
export class ProjectRanking {
  @Field()
  projectPreview: ProjectPreview;

  @Field()
  value: number;
}
