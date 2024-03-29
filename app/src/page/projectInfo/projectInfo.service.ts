import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectService } from 'src/api/project/project.service';
import { ProjectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { projectUrlById } from 'src/config/api';
import {
  ProjectInfo,
  ProjectSessionInfo,
  ProjectTeamInfo,
} from './models/projectInfo.model';

@Injectable()
export class ProjectInfoService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectSessionService: ProjectSessionService,
    private readonly teamService: TeamService,
  ) {}

  async projectInfo(projectName: string): Promise<ProjectInfo> {
    const projectPreview =
      await this.projectService.findOneProjectPreviewAndLean({
        filter: { name: projectName },
      });

    if (!projectPreview) {
      throw new NotFoundException();
    }

    const projectId = projectPreview.id;

    const projectTeamInfo = await this.projectTeamInfo(projectId);
    const projectSessionsInfo = await this.projectSessionInfo(projectId);

    return {
      id: projectId,
      name: projectPreview.name,
      url: projectUrlById(projectId),
      circle: projectPreview.circle,
      pdfUrl: projectPreview.pdfUrl,
      ...projectTeamInfo,
      ...projectSessionsInfo,
    };
  }

  @CacheOnReturn()
  private async projectSessionInfo(
    projectId: number,
  ): Promise<ProjectSessionInfo> {
    return await this.projectSessionService.projectSessionInfo(projectId);
  }

  @CacheOnReturn()
  private async projectTeamInfo(projectId: number): Promise<ProjectTeamInfo> {
    const currRegisteredTeamCount = await this.teamService.count({
      projectId: projectId,
      status: 'in_progress',
    });

    const closedTeamCount = await this.teamService.count({
      projectId: projectId,
      $or: [{ status: 'waiting_for_correction' }, { status: 'finished' }],
    });

    const averagePassFinalMark = await this.teamService.averagePassFinalMark(
      projectId,
    );

    const validatedRate = await this.teamService.validatedRate({
      projectId: projectId,
    });

    return {
      averagePassFinalMark,
      currRegisteredTeamCount,
      closedTeamCount,
      validatedRate,
    };
  }
}
