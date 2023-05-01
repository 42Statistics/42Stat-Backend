import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/coalitions_user/coalitionsUser.module';
import { CoalitionsUserService } from 'src/coalitions_user/coalitionsUser.service';
import { CursusUserModule } from 'src/cursus_user/cursusUser.module';
import { CursusUserService } from 'src/cursus_user/cursusUser.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TitlesUserModule } from 'src/titles_user/titlesUser.module';
import { TitlesUserService } from 'src/titles_user/titlesUser.service';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    CursusUserModule,
    TitlesUserModule,
    ScoreModule,
    CoalitionsUserModule,
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
