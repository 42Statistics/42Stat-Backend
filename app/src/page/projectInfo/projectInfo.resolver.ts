import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectInfo } from './models/projectInfo.model';
import { ProjectInfoService } from './projectInfo.service';

@Resolver((_of: unknown) => ProjectInfo)
export class ProjectInfoResolver {
  constructor(private projectInfoService: ProjectInfoService) {}

  @Query((_returns) => ProjectInfo)
  async getProjectInfo(
    @Args('projectName', { defaultValue: 'libft' }) projectName: string,
  ) {
    return {
      id: 10147,
      name: 'Libft',
      skills: ['c', 'Makefile'],
      keywords: ['Unix logic'],
      description:
        'This project is your very first project as a student at 42. You will need to recode a few functions of the C standard library as well as some other utility functions that you will use during your whole cursus.',
      minUserCount: 1,
      maxUserCount: 1,
      duration: 24,
      difficulty: 462,
      currRegisteredTeamCount: 100,
      closedTeamCount: 1000,
      averagePassFinalMark: 109,
      evalInfo: { totalEvalCount: 990, passCount: 550, failCount: 440 },
    };
  }
}
