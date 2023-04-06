import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [ScaleTeamModule],
  providers: [TotalResolver, TotalService, ScaleTeamService],
})
export class TotalModule {}
