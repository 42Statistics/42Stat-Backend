import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { LandingResolver } from './landing.resolver';
import { LandingService } from './landing.service';

@Module({
  imports: [CursusUserModule, ScaleTeamModule],
  providers: [
    LandingResolver,
    LandingService,
    CursusUserService,
    ScaleTeamService,
  ],
})
// eslint-diable-next-line
export class LandingModule {}
