import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamDocument } from 'src/api/exam/db/exam.database.schema';
import { ExamService } from 'src/api/exam/exam.service';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { TeamService } from 'src/api/team/team.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  ExamResult,
  ExamResultDateRanged,
  ProjectRank,
} from './models/home.team.model';

@Injectable()
export class HomeTeamService {
  constructor(
    private projectsUserService: ProjectsUserService,
    private teamService: TeamService,
    private examService: ExamService,
    private dateRangeService: DateRangeService,
  ) {}

  async currRegisteredCountRanking(limit: number): Promise<ProjectRank[]> {
    return await this.projectsUserService.currRegisteredCountRanking(limit);
  }

  async recentExamResult(after: number): Promise<ExamResultDateRanged> {
    const recentExams: Pick<
      ExamDocument,
      'beginAt' | 'endAt' | 'location' | 'maxPeople' | 'name' | 'projects'
    >[] = await this.examService.findAll({
      select: {
        beginAt: 1,
        endAt: 1,
        location: 1,
        maxPeople: 1,
        name: 1,
        projects: 1,
      },
      sort: { beginAt: -1 },
      skip: Math.max(after - 2, 0),
      limit: isFirstExam(after) ? 1 : 2,
    });

    if (!recentExams.length) {
      throw new NotFoundException();
    }

    const [firstExam, secondExam] = recentExams;

    const targetBeginAt = secondExam ? secondExam.beginAt : firstExam.beginAt;

    const nextBeginAt = secondExam ? firstExam.beginAt : undefined;

    const targetProjects = secondExam
      ? secondExam.projects
      : firstExam.projects;

    const projectIds = targetProjects.map((item) => item.id);

    const resultPerRank = await this.teamService.examResult(
      targetBeginAt,
      nextBeginAt,
      projectIds,
    );

    const nbrSubscribers = resultPerRank.reduce(
      (acc, curr) => acc + curr.rate.total,
      0,
    );

    const {
      beginAt,
      endAt,
      location,
      maxPeople = 0,
      name,
    } = secondExam ?? firstExam;

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
      start: beginAt,
      end: endAt,
    });
  }
}

const isFirstExam = (after: number): boolean => after === 1;
