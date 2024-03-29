import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ProjectsUserModule } from 'src/api/projectsUser/projectsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { LandingResolver } from './landing.resolver';
import { LandingService } from './landing.service';

@Module({
  imports: [CursusUserModule, ScaleTeamModule, ProjectsUserModule],
  providers: [LandingResolver, LandingService],
})
// eslint-disable-next-line
export class LandingModule {}
