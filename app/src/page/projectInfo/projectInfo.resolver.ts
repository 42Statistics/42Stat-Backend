import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectInfo } from './models/projectInfo.model';
import { ProjectInfoService } from './projectInfo.service';

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
