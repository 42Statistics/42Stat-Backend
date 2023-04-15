import { Module } from '@nestjs/common';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [ScaleTeamsModule],
  providers: [HomeResolver, HomeService, ScaleTeamsService],
})
export class HomeModule {}
