import { Field, ObjectType } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';

@ObjectType()
export class Location {
  @Field()
  id: number;

  @Field()
  beginAt: Date;

  @Field()
  campusId: number;

  @Field({ nullable: true })
  endAt?: Date;

  @Field()
  host: string;

  @Field()
  primary: boolean;

  @Field()
  user: UserProfile;
}
