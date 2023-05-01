import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/coalitions_user/coalitionsUser.module';
import { CoalitionsUserService } from 'src/coalitions_user/coalitionsUser.service';
import { CursusUserModule } from 'src/cursus_user/cursusUser.module';
import { CursusUserService } from 'src/cursus_user/cursusUser.service';
import { PersonalGeneralModule } from 'src/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TitlesUserModule } from 'src/titles_user/titlesUser.module';
import { TitlesUserService } from 'src/titles_user/titlesUser.service';
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
