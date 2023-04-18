import { Args, Query, Resolver } from '@nestjs/graphql';
import { Project } from './models/project.model';
import { ProjectPreview } from './models/project.preview';
import { ProjectService } from './project.service';

@Resolver((_of: unknown) => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query((_returns) => [ProjectPreview], { nullable: 'items' })
  async findProjectPreview(
    @Args('name', { defaultValue: '' }) name: string,
  ): Promise<ProjectPreview[]> {
    const projects = await this.projectService.findByName(name);

    return projects.map(this.projectService.convertToPreview);
  }
}
