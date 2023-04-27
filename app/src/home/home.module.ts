import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [ScaleTeamModule],
  providers: [HomeResolver, HomeService, ScaleTeamService],
})
export class HomeModule {}
