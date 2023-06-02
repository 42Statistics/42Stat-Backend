import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LocationModule } from 'src/api/location/location.module';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TitlesUserModule } from 'src/api/titlesUser/titlesUser.module';
import { TitlesUserService } from 'src/api/titlesUser/titlesUser.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    CoalitionsUserModule,
    CursusUserModule,
    LocationModule,
    ScoreModule,
    TitlesUserModule,
  ],
  providers: [
    PersonalGeneralResolver,
    PersonalGeneralService,
    CursusUserService,
    TitlesUserService,
    ScoreService,
    CoalitionsUserService,
  ],
})
// eslint-disable-next-line
export class PersonalGeneralModule {}
