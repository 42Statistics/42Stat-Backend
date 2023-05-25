import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/cursusUser/cursusUser.service';
import { LocationModule } from 'src/location/location.module';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TitlesUserModule } from 'src/titlesUser/titlesUser.module';
import { TitlesUserService } from 'src/titlesUser/titlesUser.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    CursusUserModule,
    TitlesUserModule,
    ScoreModule,
    CoalitionsUserModule,
    LocationModule,
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
