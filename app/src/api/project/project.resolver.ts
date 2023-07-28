import { Args, Query, Resolver } from '@nestjs/graphql';
import { projectSearchInput } from './dtos/project.dto';
import { Project } from './models/project.model';
import { ProjectPreview } from './models/project.preview';
import { ProjectService } from './project.service';

@Resolver((_of: unknown) => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  // todo: deprecated at v0.6.0
  @Query((_returns) => [ProjectPreview], {
    deprecationReason: 'search module 로 분리',
  })
  async findProjectPreview(
    @Args() { name, limit }: projectSearchInput,
  ): Promise<ProjectPreview[]> {
    return await this.projectService.findProjectPreviewByName(name, limit);
  }
}
