import { Module } from '@nestjs/common';
import { TimeService } from 'src/common/time.calculate';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';
import { UserProfileResolver } from './personal.general.userProfile.resolver';

@Module({
  imports: [ScaleTeamsModule],
  providers: [
    PersonalGeneralResolver,
    PersonalGeneralService,
    UserProfileResolver,
    ScaleTeamsService,
    TimeService,
  ],
})
export class PersonalGeneralModule {}
