import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/api/project/project.module';
import { ProjectService } from 'src/api/project/project.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { PaginationCursorModule } from 'src/pagination/cursor/pagination.cursor.module';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { EvalLogResolver } from './evalLog.resolver';
import { EvalLogService } from './evalLog.service';

@Module({
  imports: [ScaleTeamModule, ProjectModule, PaginationCursorModule],
  providers: [
    EvalLogResolver,
    EvalLogService,
    ScaleTeamService,
    ProjectService,
    PaginationCursorService,
  ],
})
// eslint-disable-next-line
export class EvalLogModule {}
