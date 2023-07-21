import { Injectable } from '@nestjs/common';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { EXAM_PROJECT_IDS } from 'src/api/exam/exam.service';
import { LocationCacheService } from 'src/api/location/location.cache.service';
import type { project } from 'src/api/project/db/project.database.schema';
import type { projects_user } from 'src/api/projectsUser/db/projectsUser.database.schema';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import type { quests_user } from 'src/api/questsUser/db/questsUser.database.schema';
import {
  COMMON_CORE_QUEST_ID,
  QuestsUserService,
} from 'src/api/questsUser/questsUser.service';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import {
  OUTSTANDING_FLAG_ID,
  ScaleTeamService,
} from 'src/api/scaleTeam/scaleTeam.service';
import type { team } from 'src/api/team/db/team.database.schema';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { partition } from 'src/common/partition';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import {
  MULTIPLY_TABLE,
  SCORE_TABLE,
  Table,
} from 'src/page/personal/general/character/personal.general.characer.table';
import { StatDate } from 'src/statDate/StatDate';
import type { Character } from './models/personal.general.character.model';
import { findPokemon } from './personal.general.character.pokemon';

type QuestsUserDate = Pick<quests_user, 'createdAt' | 'validatedAt'>;

type ProjectsUserForCharacter = Pick<projects_user, 'finalMark'> & {
  teams: Pick<team, 'validated?' | 'finalMark'>[];
  project: Pick<project, 'id'>;
};

@Injectable()
export class PersonalGeneralCharacterService {
  constructor(
    private cursusUserCacheService: CursusUserCacheService,
    private projectsUserService: ProjectsUserService,
    private questsUserService: QuestsUserService,
    private locationCacheService: LocationCacheService,
    private scaleTeamService: ScaleTeamService,
    private scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  @CacheOnReturn()
  async character(userId: number): Promise<Character | null> {
    const userFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    if (!userFullProfile) {
      return null;
    }

    const characterScore = await this.characterScore(userId);

    if (!characterScore) {
      return null;
    }

    return findPokemon(
      characterScore.effort,
      characterScore.talent,
      userFullProfile.coalition,
    );
  }

  // todo: test 함수
  async test() {
    const users = await this.cursusUserCacheService.getAllUserFullProfile();

    const viewMap = new Map();
    const results = await Promise.all(
      // eslint-disable-next-line
      [...users!.values()].map(async (user) => {
        const currtemp = await this.characterScore(user.cursusUser.user.id);
        const curr = `${currtemp?.effort},${currtemp?.talent}`;

        if (
          [
            'jaham',
            'jeongble',
            'yopark',
            'hahseo',
            'cjeon',
            'mypark',
            'yeju',
            'jaemjeon',
            'jkong',
            'chanhpar',
            'hdoo',
          ].find((el) => el === user.cursusUser.user.login)
        ) {
          console.log(user.cursusUser.user.login, curr);
        }

        const prev = viewMap.get(curr) ?? [];
        prev.push(user.cursusUser.user.login);
        viewMap.set(curr, prev);

        return curr;
      }),
    );

    [...viewMap.entries()].forEach((curr) => {
      console.log(curr[0], curr[1].reverse().slice(0, 5));
    });

    console.log('===');

    const stat = new Map();
    results.forEach((result) => {
      const prev = stat.get(result);
      stat.set(result, (prev ?? 0) + 1);
    });

    [...stat.entries()]
      .sort(
        (a, b) => parseInt(a[0].split(',')[0]) - parseInt(b[0].split(',')[0]),
      )
      .forEach((curr) => {
        console.log(curr[0], curr[1]);
      });
  }

  private async characterScore(
    userId: number,
  ): Promise<{ effort: number; talent: number } | null> {
    const questsUserDate: QuestsUserDate = await this.questsUserService.findOne(
      {
        filter: { 'quest.id': COMMON_CORE_QUEST_ID },
        select: { createdAt: 1, validatedAt: 1 },
      },
    );

    const projectsUsers: ProjectsUserForCharacter[] =
      await this.projectsUserService.findAll({
        filter: { 'user.id': userId, 'validated?': { $ne: null } },
        select: {
          'teams.finalMark': 1,
          'teams.validated?': 1,
          'project.id': 1,
          finalMark: 1,
        },
      });

    const [examTeamsPerExam, projectTeamsPerProject] = partition(
      projectsUsers,
      (projectUser) => isExam(projectUser.project.id),
    );

    const evalCountRank = await this.scaleTeamCacheService.getEvalCountRank(
      DateTemplate.TOTAL,
      userId,
    );

    if (!evalCountRank) {
      return null;
    }

    const logtimeRank = await this.locationCacheService.getLogtimeRank(
      DateTemplate.TOTAL,
      userId,
    );

    if (!logtimeRank) {
      return null;
    }

    const correctedCount = await this.scaleTeamService.evalCount({
      'correcteds.id': userId,
    });

    const outstandingCount = await this.scaleTeamService.evalCount({
      'correcteds.id': userId,
      'flag.id': OUTSTANDING_FLAG_ID,
    });

    const effortScore = this.effort(
      projectTeamsPerProject,
      examTeamsPerExam,
      evalCountRank.value,
      logtimeRank.value,
    );

    const talentScore = this.talent(
      questsUserDate,
      projectTeamsPerProject,
      examTeamsPerExam,
      correctedCount,
      outstandingCount,
    );

    return {
      effort: effortScore,
      talent: talentScore,
    };
  }

  private effort(
    projectTeamsPerProject: ProjectsUserForCharacter[],
    examTeamsPerExam: ProjectsUserForCharacter[],
    evalCount: number,
    logtime: number,
  ): number {
    const { bonusCount, projectTryCount } = projectTeamsPerProject.reduce(
      (acc, curr) => {
        if (curr.finalMark && curr.finalMark > 100) {
          acc.bonusCount++;
        }

        acc.projectTryCount += curr.teams.filter(
          (team) => team['validated?'] !== null,
        ).length;

        return acc;
      },
      { bonusCount: 0, projectTryCount: 0 },
    );

    const examTryCount = examTeamsPerExam.reduce((examTryCount, { teams }) => {
      examTryCount += teams.filter(
        (team) => team['validated?'] !== null,
      ).length;

      return examTryCount;
    }, 0);

    let effortValue = 0;

    effortValue += calculateScore(evalCount, SCORE_TABLE.EVAL_COUNT).toScore();
    effortValue += calculateScore(logtime, SCORE_TABLE.LOGTIME).toScore();
    effortValue += calculateScore(examTryCount, SCORE_TABLE.EXAM_TRY).toScore();
    effortValue += calculateScore(bonusCount, SCORE_TABLE.BONUS).toScore();
    effortValue += calculateScore(
      projectTryCount,
      SCORE_TABLE.PROJECT_TRY,
    ).toScore();

    return calculateScore(effortValue, SCORE_TABLE.EFFORT).toScore();
  }

  private talent(
    { createdAt: commonCoreBegin, validatedAt: commonCoreEnd }: QuestsUserDate,
    projectTeamsPerProject: ProjectsUserForCharacter[],
    examTeamsPerExam: ProjectsUserForCharacter[],
    correctedCount: number,
    outstandingCount: number,
  ): number {
    const commonCoreDuration = commonCoreEnd
      ? Math.floor(
          (commonCoreEnd.getTime() - commonCoreBegin.getTime()) / StatDate.DAY,
        )
      : null;

    const projectOneShotRate = calculateOneShotRate(projectTeamsPerProject);
    const examOneShotRate = calculateOneShotRate(examTeamsPerExam);
    const outstandingRate =
      correctedCount === 0
        ? 0
        : Math.floor((outstandingCount / correctedCount) * 100);

    let talentValue = 0;

    if (commonCoreDuration) {
      talentValue += calculateScore(
        commonCoreDuration,
        SCORE_TABLE.COMMON_CORE_DURATION,
        (userValue, targetValue) => userValue <= targetValue,
      ).toScore();
    }

    talentValue += calculateScore(
      projectOneShotRate,
      SCORE_TABLE.PROJECT_ONE_SHOT_RATE,
    ).toMultiplyScore(
      projectTeamsPerProject.length,
      MULTIPLY_TABLE.PROJECT_ONE_SHOT_RATE,
    );

    talentValue += calculateScore(
      examOneShotRate,
      SCORE_TABLE.EXAM_ONE_SHOT_RATE,
    ).toMultiplyScore(
      examTeamsPerExam.length,
      MULTIPLY_TABLE.EXAM_ONE_SHOT_RATE,
    );

    talentValue += calculateScore(
      outstandingRate,
      SCORE_TABLE.OUTSTANDING_RATE,
    ).toMultiplyScore(correctedCount, MULTIPLY_TABLE.OUTSTANDING_RATE);

    return calculateScore(talentValue, SCORE_TABLE.TALENT).toScore();
  }
}

const isExam = (projectId: number): boolean =>
  EXAM_PROJECT_IDS.find((id) => id === projectId) !== undefined;

const calculateScore = (
  userValue: number,
  table: Table,
  validateFn: (userValue: number, targetValue: number) => boolean = (
    userValue,
    targetValue,
  ) => userValue >= targetValue,
): {
  toScore: () => number;
  toMultiplyScore: (multiplyValue: number, multiplyTable: Table) => number;
} => {
  let result = 0;

  for (const { score, targetValue } of table) {
    if (!validateFn(userValue, targetValue)) {
      break;
    }

    result = score;
  }

  return {
    toScore: () => result,
    toMultiplyScore: (multiplyValue: number, multiplyTable: Table) =>
      result * calculateScore(multiplyValue, multiplyTable).toScore(),
  };
};

const calculateOneShotRate = (projectsUsers: ProjectsUserForCharacter[]) => {
  const { total, oneShot } = projectsUsers.reduce(
    (acc, curr) => {
      return {
        total: acc.total + 1,
        oneShot: acc.oneShot + Number(curr.teams[0]['validated?'] === true),
      };
    },
    { total: 0, oneShot: 0 },
  );

  return total === 0 ? 0 : Math.floor((oneShot / total) * 100);
};
