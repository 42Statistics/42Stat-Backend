import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { HomeEvalResolver } from './home.eval.resolver';
import { HomeEvalService } from './home.eval.service';

@Module({
  imports: [ScaleTeamModule, CursusUserModule, DateRangeModule],
  providers: [
    HomeEvalResolver,
    HomeEvalService,
    ScaleTeamService,
    CursusUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class HomeEvalModule {}
