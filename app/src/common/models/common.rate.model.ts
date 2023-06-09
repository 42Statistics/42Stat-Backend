import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pair {
  @Field()
  key: string;

  @Field()
  value: number;
}

@ObjectType()
export class Rate {
  @Field()
  total: number;

  @Field((_type) => [Pair])
  fields: Pair[];
}
