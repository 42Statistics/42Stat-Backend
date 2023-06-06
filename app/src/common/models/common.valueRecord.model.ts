import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IntRecord {
  @Field()
  at: Date;

  @Field()
  value: number;
}
