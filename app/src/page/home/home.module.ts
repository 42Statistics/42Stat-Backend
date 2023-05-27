import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [ScaleTeamModule, CursusUserModule],
  providers: [HomeResolver, HomeService, ScaleTeamService],
})
export class HomeModule {}
