import { Injectable, NotFoundException } from '@nestjs/common';
import type { exam } from 'src/api/exam/db/exam.database.schema';
import { ExamService } from 'src/api/exam/exam.service';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type {
  ExamResult,
  ExamResultDateRanged,
  ProjectRank,
} from './models/home.team.model';

@Injectable()
export class HomeTeamService {
  constructor(
    private readonly projectsUserService: ProjectsUserService,
    private readonly teamService: TeamService,
    private readonly examService: ExamService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async currRegisteredCountRanking(limit: number): Promise<ProjectRank[]> {
    return await this.projectsUserService.currRegisteredCountRanking(limit);
  }

  @CacheOnReturn()
  async recentExamResult(skip: number): Promise<ExamResultDateRanged> {
    const targetExam: Pick<
      exam,
      'beginAt' | 'endAt' | 'location' | 'maxPeople' | 'name' | 'projects'
    > | null = await this.examService.findOneAndLean({
      filter: { endAt: { $lt: new Date() } },
      sort: { beginAt: -1 },
      skip: skip,
      select: {
        beginAt: 1,
        endAt: 1,
        location: 1,
        maxPeople: 1,
        name: 1,
        projects: 1,
      },
    });

    if (!targetExam) {
      throw new NotFoundException();
    }

    const adjustTargetEndAt = new DateWrapper(targetExam.endAt)
      .moveHour(1)
      .toDate();

    const resultPerRank = await this.teamService.examResult(
      targetExam.beginAt,
      adjustTargetEndAt,
      targetExam.projects,
    );

    const nbrSubscribers = resultPerRank.reduce(
      (acc, curr) => acc + curr.rate.total,
      0,
    );

    const { beginAt, endAt, location, maxPeople = 0, name } = targetExam;

    const result: ExamResult = {
      resultPerRank,
      nbrSubscribers,
      beginAt,
      endAt,
      location,
      maxPeople,
      name,
    };

    return this.dateRangeService.toDateRanged(result, {
      start: targetExam.beginAt,
      end: targetExam.endAt,
    });
  }
}
