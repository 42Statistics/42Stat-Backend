import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { projectSearchInput } from './dtos/project.dto';
import { ProjectService } from './project.service';

@Resolver((_of: unknown) => ProjectPreview)
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
