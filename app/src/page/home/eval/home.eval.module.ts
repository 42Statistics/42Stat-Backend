import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeEvalResolver } from './home.eval.resolver';
import { HomeEvalService } from './home.eval.service';

@Module({
  imports: [ScaleTeamModule, CursusUserModule, DateRangeModule],
  providers: [HomeEvalResolver, HomeEvalService],
})
// eslint-disable-next-line
export class HomeEvalModule {}
