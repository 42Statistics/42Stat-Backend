import { Module } from '@nestjs/common';
import { PersonalGeneralResolver, UserProfileResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [],
  providers: [PersonalGeneralResolver, PersonalGeneralService, UserProfileResolver],
})
export class PersonalGeneralModule {}
