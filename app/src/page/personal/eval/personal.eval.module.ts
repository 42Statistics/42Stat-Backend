import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { TeamModule } from 'src/api/team/team.module';
import { DailyEvalCountModule } from 'src/dailyEvalCount/dailyEvalCount.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { PersonalUtilModule } from '../util/personal.util.module';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [
    PersonalUtilModule,
    ScaleTeamModule,
    ScoreModule,
    CursusUserModule,
    DateRangeModule,
    TeamModule,
    DailyEvalCountModule,
  ],
  providers: [PersonalEvalResolver, PersonalEvalService],
})
// eslint-disable-next-line
export class PersonalEvalModule {}
