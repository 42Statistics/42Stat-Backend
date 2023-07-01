import { Args, Query, Resolver } from '@nestjs/graphql';
import { projectSearchInput } from './dtos/project.dto';
import { Project } from './models/project.model';
import { ProjectPreview } from './models/project.preview';
import { ProjectService } from './project.service';

@Resolver((_of: unknown) => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query((_returns) => [ProjectPreview])
  async findProjectPreview(
    @Args() { name, limit }: projectSearchInput,
  ): Promise<ProjectPreview[]> {
    return await this.projectService.findProjectPreviewByName(name, limit);
  }
}
