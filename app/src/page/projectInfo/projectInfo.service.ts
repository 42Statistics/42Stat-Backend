import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from 'src/api/project/project.service';
import { ProjectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { API_CONFIG, projectUrlById, type ApiConfig } from 'src/config/api';
import {
  ProjectInfo,
  ProjectSessionInfo,
  ProjectTeamInfo,
} from './models/projectInfo.model';

@Injectable()
export class ProjectInfoService {
  private readonly PROJECT_CIRCLES: Record<number, number>;

  constructor(
    private readonly projectService: ProjectService,
    private readonly projectSessionService: ProjectSessionService,
    private readonly teamService: TeamService,
    private readonly configService: ConfigService,
  ) {
    this.PROJECT_CIRCLES =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).PROJECT_CIRCLES;
  }

  async projectInfo(projectName: string): Promise<ProjectInfo> {
    const project: { id: number; name: string } | null =
      await this.projectService.findOneAndLean({
        filter: { name: projectName },
        select: { id: 1, name: 1 },
      });

    if (!project) {
      throw new NotFoundException();
    }

    const projectId = project.id;

    const projectTeamInfo = await this.projectTeamInfo(projectId);
    const projectSessionsInfo = await this.projectSessionInfo(projectId);

    return {
      id: projectId,
      name: project.name,
      url: projectUrlById(projectId),
      circle: this.PROJECT_CIRCLES[projectId],
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
