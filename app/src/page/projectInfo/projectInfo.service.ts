import { Injectable } from '@nestjs/common';
import { ProjectService } from 'src/api/project/project.service';
import { projectSessionService } from 'src/api/projectSession/projectSession.service';
import { TeamService } from 'src/api/team/team.service';
import {
  Project,
  ProjectSessionInfo,
  TeamCount,
  TeamMemberCount,
} from './models/projectInfo.model';

@Injectable()
export class ProjectInfoService {
  constructor(
    private projectService: ProjectService,
    private projectSesstionService: projectSessionService,
    private teamService: TeamService,
  ) {}
  async projectInfo(projectName: string): Promise<Project> {
    const [project] = await this.projectService.findByName(projectName);
    const projectId = project.id;

    const teamCount = await this.teamCount(projectId);
    const teamMemberCount = await this.teamMemberCount(projectId);
    const projectSessionsInfo = await this.projectSessionInfo(projectId);
    return {
      name: project.name,
      ...teamCount,
      ...teamMemberCount,
      ...projectSessionsInfo,
    };
  }

  async projectSessionInfo(projectId: number): Promise<ProjectSessionInfo> {
    return await this.projectSesstionService.projectSessionInfo(projectId);
  }

  async teamMemberCount(projectId: number): Promise<TeamMemberCount> {
    return await this.projectService.teamMemberCount(projectId);
  }

  async teamCount(projectId: number): Promise<TeamCount> {
    const currRegisteredTeamCount = await this.teamService.teamCount({
      projectId: projectId,
      status: 'in_progress',
    });

    const closedTeamCount = await this.teamService.teamCount({
      projectId: projectId,
      $or: [{ status: 'waiting_for_correction' }, { status: 'finished' }],
    });

    const averagePassFinalMark = await this.teamService.averagePassFinalMark(
      projectId,
    );

    const evalInfo = await this.teamService.evalInfo(projectId);

    return {
      averagePassFinalMark,
      currRegisteredTeamCount,
      closedTeamCount,
      evalInfo,
    };
  }
}
