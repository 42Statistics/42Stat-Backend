import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/cursusUser/cursusUser.service';
import { PersonalGeneralModule } from 'src/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TitlesUserModule } from 'src/titlesUser/titlesUser.module';
import { TitlesUserService } from 'src/titlesUser/titlesUser.service';
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
