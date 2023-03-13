import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field((_type) => Int)
  id: number;

  @Field()
  name: String;

  @Field()
  isExam: boolean;

  @Field()
  skills: string; // todo: Skill

  @Field()
  currentUsers: string; // todo: User[]

  @Field()
  graph: string; // todo: Teams graph
}
