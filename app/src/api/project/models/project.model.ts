import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  difficulty?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  exam: boolean;
}
