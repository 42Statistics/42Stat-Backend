import { Injectable } from '@nestjs/common';
import { ProjectService } from 'src/api/project/project.service';
import { ProjectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamService } from 'src/api/team/team.service';
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
    const project = await this.projectService.findOne({
      name: projectName,
    });

    const projectId = project.id;

    const projectTeamInfo = await this.projectTeamInfo(projectId);
    const projectSessionsInfo = await this.projectSessionInfo(projectId);
    return {
      name: project.name,
      ...projectTeamInfo,
      ...projectSessionsInfo,
    };
  }

  async projectSessionInfo(projectId: number): Promise<ProjectSessionInfo> {
    return await this.projectSessionService.projectSessionInfo(projectId);
  }

  async projectTeamInfo(projectId: number): Promise<ProjectTeamInfo> {
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
