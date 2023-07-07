import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { ProjectInfo } from './models/projectInfo.model';
import { ProjectInfoService } from './projectInfo.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => ProjectInfo)
export class ProjectInfoResolver {
  constructor(private projectInfoService: ProjectInfoService) {}

  @Query((_returns) => ProjectInfo)
  async getProjectInfo(
    @Args('projectName', { defaultValue: 'Libft' }) projectName: string,
  ): Promise<ProjectInfo> {
    return await this.projectInfoService.projectInfo(projectName);
  }
}
