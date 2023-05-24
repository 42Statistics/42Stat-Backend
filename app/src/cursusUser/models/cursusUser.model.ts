import { ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';

@ObjectType()
export class CursusUserProfile extends OmitType(UserProfile, [
  'titles',
  'scoreInfo',
]) {}
