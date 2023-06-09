import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LocationModule } from 'src/api/location/location.module';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TeamModule } from 'src/api/team/team.module';
import { TeamService } from 'src/api/team/team.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { PersonalUtilModule } from '../util/personal.util.module';
import { PersonalUtilService } from '../util/personal.util.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    PersonalUtilModule,
    ScoreModule,
    CursusUserModule,
    LocationModule,
    TeamModule,
    DateRangeModule,
  ],
  providers: [
    PersonalGeneralResolver,
    PersonalGeneralService,
    PersonalUtilService,
    ScoreService,
    CursusUserService,
    TeamService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class PersonalGeneralModule {}
