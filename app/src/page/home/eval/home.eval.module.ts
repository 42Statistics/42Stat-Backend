import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeEvalResolver } from './home.eval.resolver';
import { HomeEvalService } from './home.eval.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';

@Module({
  imports: [ScaleTeamModule, DateRangeModule],
  providers: [
    HomeEvalResolver,
    HomeEvalService,
    ScaleTeamService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class HomeEvalModule {}
