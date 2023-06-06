import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LocationModule } from 'src/api/location/location.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    CoalitionsUserModule,
    CursusUserModule,
    LocationModule,
    DateRangeModule,
  ],
  providers: [
    PersonalGeneralResolver,
    PersonalGeneralService,
    CursusUserService,
    CoalitionsUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class PersonalGeneralModule {}
