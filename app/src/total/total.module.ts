import { Module } from '@nestjs/common';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [ScaleTeamsModule],
  providers: [TotalResolver, TotalService, ScaleTeamsService],
})
export class TotalModule {}
