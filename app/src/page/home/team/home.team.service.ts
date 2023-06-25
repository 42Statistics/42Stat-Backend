import { Injectable, NotFoundException } from '@nestjs/common';
import type { ExamDocument } from 'src/api/exam/db/exam.database.schema';
import { ExamService } from 'src/api/exam/exam.service';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { TeamService } from 'src/api/team/team.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { StatDate } from 'src/statDate/StatDate';
import type {
  ExamResult,
  ExamResultDateRanged,
  ProjectRank,
} from './models/home.team.model';

type selectedExamDocument = Pick<
  ExamDocument,
  'beginAt' | 'endAt' | 'location' | 'maxPeople' | 'name' | 'projects'
>;

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
    const recentExams: selectedExamDocument[] = await this.examService.findAll({
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
      limit: isRecentExam(after) ? 1 : 2,
    });

    const [targetExam, nextExam] = recentExams;

    if (outBoundIndex(nextExam, after)) {
      throw new NotFoundException();
    }

    const targetBeginAt = nextExam ? nextExam.beginAt : targetExam.beginAt;

    const nextBeginAt = nextExam ? targetExam.beginAt : new StatDate();

    const targetProjects = nextExam ? nextExam.projects : targetExam.projects;

    const resultPerRank = await this.teamService.examResult(
      targetBeginAt,
      nextBeginAt,
      targetProjects,
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
    } = nextExam ?? targetExam;

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

const isRecentExam = (after: number): boolean => after === 1;
const outBoundIndex = (
  nextExam: selectedExamDocument,
  after: number,
): boolean => !nextExam && !isRecentExam(after);
