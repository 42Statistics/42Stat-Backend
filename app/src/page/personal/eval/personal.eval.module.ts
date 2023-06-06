import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';
import { PersonalUtilModule } from '../util/personal.util.module';
import { PersonalUtilService } from '../util/personal.util.service';

@Module({
  imports: [
    PersonalUtilModule,
    ScaleTeamModule,
    ScoreModule,
    CursusUserModule,
    DateRangeModule,
  ],
  providers: [
    PersonalEvalResolver,
    PersonalEvalService,
    PersonalUtilService,
    ScaleTeamService,
    ScoreService,
    CursusUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class PersonalEvalModule {}
