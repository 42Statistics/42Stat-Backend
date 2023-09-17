import { Field, ObjectType } from '@nestjs/graphql';
import type { project } from 'src/api/project/db/project.database.schema';

@ObjectType()
export class ProjectPreview implements Pick<project, 'id' | 'name'> {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  circle?: number;

  @Field({ nullable: true })
  pdfUrl?: string;

  @Field({ nullable: true })
  difficulty?: number;
}
