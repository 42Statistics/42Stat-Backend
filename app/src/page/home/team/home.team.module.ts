import { Module } from '@nestjs/common';
import { ExamModule } from 'src/api/exam/exam.module';
import { ProjectsUserModule } from 'src/api/projectsUser/projectsUser.module';
import { TeamModule } from 'src/api/team/team.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeTeamResolver } from './home.team.resolver';
import { HomeTeamService } from './home.team.service';

@Module({
  imports: [ProjectsUserModule, TeamModule, ExamModule, DateRangeModule],
  providers: [HomeTeamResolver, HomeTeamService],
})
// eslint-disable-next-line
export class HomeTeamModule {}
