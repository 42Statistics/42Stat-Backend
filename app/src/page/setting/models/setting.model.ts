import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Setting {
  @Field()
  userLogin: string;

  @Field({ nullable: true })
  googleEmail?: string;

  @Field({ nullable: true })
  linkedTime?: Date;
}
