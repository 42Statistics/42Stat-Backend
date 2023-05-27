import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LocationModule } from 'src/api/location/location.module';
import { PersonalGeneralModule } from 'src/page/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/page/personalGeneral/personal.general.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TitlesUserModule } from 'src/api/titlesUser/titlesUser.module';
import { TitlesUserService } from 'src/api/titlesUser/titlesUser.service';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [
    PersonalGeneralModule,
    ScaleTeamModule,
    ScoreModule,
    CoalitionsUserModule,
    CursusUserModule,
    TitlesUserModule,
    LocationModule,
  ],
  providers: [
    PersonalEvalResolver,
    PersonalEvalService,
    PersonalGeneralService,
    ScaleTeamService,
    ScoreService,
    CoalitionsUserService,
    CursusUserService,
    TitlesUserService,
  ],
})
// eslint-disable-next-line
export class PersonalEvalModule {}
