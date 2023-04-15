import { Field, Float, ObjectType, PickType } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';

@ObjectType()
export class UserPreview extends PickType(UserProfile, [
  'id',
  'login',
  'imgUrl',
]) {}

@ObjectType()
export class UserRanking {
  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field((_type) => Float)
  value: number;
}
