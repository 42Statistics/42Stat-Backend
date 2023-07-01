import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { Project } from './project.model';

@ObjectType()
export class ProjectPreview extends PickType(Project, ['id', 'name']) {
  @Field()
  url: string;
}
