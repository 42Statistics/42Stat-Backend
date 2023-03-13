import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Project } from './models/project.model';
import { ProjectsService } from './projects.service';

@Resolver((_of: unknown) => Project)
export class ProjectResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query((_returns) => Project)
  async project(@Args('id', { type: () => Int }) id: number) {
    return await this.projectsService.findById(id);
  }
}
