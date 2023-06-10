import { Args, Query, Resolver } from '@nestjs/graphql';
import { Project } from './models/projectInfo.model';
import { ProjectInfoService } from './projectInfo.service';

@Resolver((_of: unknown) => Project)
export class ProjectInfoResolver {
  constructor(private projectInfoService: ProjectInfoService) {}

  @Query((_returns) => Project)
  async getProjectInfo(
    @Args('projectName', { defaultValue: 'Libft' }) projectName: string,
  ): Promise<Project> {
    return await this.projectInfoService.projectInfo(projectName);
  }
}
