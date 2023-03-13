import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/projects/models/project.model';

@ObjectType()
export class Exam {
  @Field((_type) => Int)
  id: number;

  @Field()
  beginAt: Date;

  @Field()
  endAt: Date;

  @Field((_type) => Int)
  nbrSubscribers: number;

  @Field()
  name: string;

  @Field((_type) => [Project])
  projects: Project[];

  @Field()
  examUser: string;
}
