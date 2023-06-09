import { Module } from '@nestjs/common';
import { HomeTeamResolver } from './home.team.resolver';
import { HomeTeamService } from './home.team.service';
import { ProjectsUserModule } from 'src/api/projectsUser/projectsUser.module';

@Module({
  imports: [ProjectsUserModule],
  providers: [HomeTeamResolver, HomeTeamService],
})
// eslint-disable-next-line
export class HomeTeamModule {}
