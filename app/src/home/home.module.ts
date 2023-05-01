import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/cursus_user/cursusUser.module';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [ScaleTeamModule, CursusUserModule],
  providers: [HomeResolver, HomeService, ScaleTeamService],
})
export class HomeModule {}
