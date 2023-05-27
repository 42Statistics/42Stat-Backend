import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { EvalLogResolver } from './evalLog.resolver';
import { EvalLogService } from './evalLog.service';
import { ProjectModule } from 'src/api/project/project.module';
import { ProjectService } from 'src/api/project/project.service';

@Module({
  imports: [ScaleTeamModule, ProjectModule],
  providers: [
    EvalLogResolver,
    EvalLogService,
    ScaleTeamService,
    ProjectService,
  ],
})
// eslint-disable-next-line
export class EvalLogModule {}
