import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coalition {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  coverUrl?: string;

  @Field({ nullable: true })
  color?: string;

  @Field()
  score: number;

  @Field()
  userId: number;
}
