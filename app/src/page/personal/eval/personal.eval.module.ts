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

@Module({
  imports: [ScaleTeamModule, ScoreModule, CursusUserModule, DateRangeModule],
  providers: [
    PersonalEvalResolver,
    PersonalEvalService,
    ScaleTeamService,
    ScoreService,
    CursusUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class PersonalEvalModule {}
