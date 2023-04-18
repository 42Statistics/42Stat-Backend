import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { Project } from './project.model';

@ObjectType()
export class ProjectPreview extends PickType(Project, ['id', 'name']) {
  @Field((_type) => URLResolver)
  url: string;
}
