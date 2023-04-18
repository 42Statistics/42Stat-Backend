import { Module } from '@nestjs/common';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';
import { UserProfileResolver } from './personal.general.userProfile.resolver';

@Module({
  imports: [],
  providers: [
    PersonalGeneralResolver,
    PersonalGeneralService,
    UserProfileResolver,
  ],
})
// eslint-disable-next-line
export class PersonalGeneralModule {}
