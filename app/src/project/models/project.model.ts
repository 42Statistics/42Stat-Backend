import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field((_type) => Int, { nullable: true })
  difficulty?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  exam: boolean;
}
