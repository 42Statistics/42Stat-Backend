import { Injectable } from '@nestjs/common';
import { ProjectService } from 'src/api/project/project.service';
import { TeamService } from 'src/api/team/team.service';
import { Rate } from 'src/common/models/common.rate.model';
import { Project } from './models/projectInfo.model';

@Injectable()
export class ProjectInfoService {
  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
  ) {}
  async projectInfo(projectName: string): Promise<Project> {
    const projectSessionsInfo = await this.projectSessionsInfo(projectName);
    const teamMemberCount = await this.teamMemberCount(projectName);
    const teamCount = await this.teamCount(projectName);
    return {
      ...teamCount,
      ...teamMemberCount,
      ...projectSessionsInfo,
    };
  }

  async projectSessionsInfo(projectName: string): Promise<{
    id: number;
    name: string;
    skills: string[];
    description: string;
    duration: number | null;
    difficulty: number;
  }> {
    return await this.projectService.projectSessionsInfo(projectName);
  }

  async teamMemberCount(
    projectName: string,
  ): Promise<{ minUserCount: number; maxUserCount: number }> {
    return await this.projectService.teamMemberCount(projectName);
  }

  async teamCount(projectName: string): Promise<{
    averagePassFinalMark: number;
    currRegisteredTeamCount: number;
    closedTeamCount: number;
    evalInfo: Rate;
  }> {
    const currRegisteredTeamCount = await this.teamService.teamCount({
      projectId: 1314,
      status: 'in_progress',
    });

    const closedTeamCount = await this.teamService.teamCount({
      projectId: 1314,
      $or: [{ status: 'waiting_for_correction' }, { status: 'finished' }],
    });

    const averagePassFinalMark = await this.teamService.averagePassFinalMark(
      projectName,
    );

    const evalInfo = await this.teamService.evalInfo(projectName);

    return {
      averagePassFinalMark,
      currRegisteredTeamCount,
      closedTeamCount,
      evalInfo,
    };
  }
}
