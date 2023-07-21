import { Injectable } from '@nestjs/common';
import {
  ProjectService,
  projectUrlById,
} from 'src/api/project/project.service';
import { ProjectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import {
  ProjectInfo,
  ProjectSessionInfo,
  ProjectTeamInfo,
} from './models/projectInfo.model';

@Injectable()
export class ProjectInfoService {
  constructor(
    private projectService: ProjectService,
    private projectSessionService: ProjectSessionService,
    private teamService: TeamService,
  ) {}

  async projectInfo(projectName: string): Promise<ProjectInfo> {
    const project: { id: number; name: string } =
      await this.projectService.findOne({
        filter: { name: projectName },
        select: { id: 1, name: 1 },
      });

    const projectId = project.id;

    const projectTeamInfo = await this.projectTeamInfo(projectId);
    const projectSessionsInfo = await this.projectSessionInfo(projectId);

    return {
      id: projectId,
      name: project.name,
      url: projectUrlById(projectId),
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
