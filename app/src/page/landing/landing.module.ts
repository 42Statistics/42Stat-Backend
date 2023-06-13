import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { LandingResolver } from './landing.resolver';
import { LandingService } from './landing.service';

@Module({
  imports: [CursusUserModule, ScaleTeamModule],
  providers: [LandingResolver, LandingService],
})
// eslint-diable-next-line
export class LandingModule {}
