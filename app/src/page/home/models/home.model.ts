import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValueRecord {
  @Field()
  at: Date;

  @Field()
  value: number;
}

//@ObjectType()
//export class ValuePerCircleByPromo {
//  @Field()
//  circle: number;

//  @Field()
//  value: number;

//  @Field()
//  promo: string;
//}
