import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { Util } from 'src/util';
import { EvalUserEnum, GetEvalInfoArgs } from './dto/getEvalInfo.args';
import { PersonalScaleTeam } from './models/personal.eval.scaleTeam.model';

@Injectable()
export class PersonalEvalService {
  constructor(private scaleTeamService: ScaleTeamsService) {}

  async getTempData() {
    const evals = JSON.parse(
      await fs.readFile('/app/temp-data-store/jaham-as-corrector.json', {
        encoding: 'utf-8',
      }),
    );

    evals.push(
      ...JSON.parse(
        await fs.readFile('/app/temp-data-store/jaham-as-corrected.json', {
          encoding: 'utf-8',
        }),
      ),
    );

    return evals;
  }

  async getSummaryByUid(uid: number) {
    const tempData = await this.getTempData();

    const tempUid = uid;

    const filtered = tempData.filter(
      (curr: any) =>
        curr.corrector.id === tempUid ||
        curr.correcteds.find((corrected: any) => corrected.id === tempUid) !==
          undefined,
    );

    const currMonth = new Date('2023-02-01T00:00:00.000Z').getTime();
    const lastMonth = new Date('2023-01-01T00:00:00.000Z').getTime();

    const totalEval = filtered.filter(
      (curr: any) => curr.corrector.id === tempUid,
    );

    const result = totalEval.reduce(
      (acc: [number, number], curr: any) => {
        if (curr.filledAt && curr.beginAt) {
          acc[0] +=
            (new Date(curr.filledAt).getTime() -
              new Date(curr.beginAt).getTime()) /
            1000 /
            60;
          acc[1] += curr.final_mark;
        }

        return acc;
      },
      [0, 0],
    );

    const evaluateLast = tempData.filter((curr: any) => {
      return (
        curr.corrector.id === tempUid &&
        new Date(curr.beginAt).getTime() >= lastMonth &&
        new Date(curr.beginAt).getTime() < currMonth
      );
    });

    const evaluateThis = tempData.filter(
      (curr: any) =>
        curr.corrector.id === tempUid &&
        new Date(curr.beginAt).getTime() >= currMonth,
    );

    return {
      currMonthCnt: evaluateThis.length,
      lastMonthCnt: evaluateLast.length,
      averageDuration: Math.floor(result[0] / totalEval.length),
      averageFinalMark: result[1] / totalEval.length,
      averageFeedbackLength: Math.floor(
        filtered.reduce((acc: number, curr: any) => {
          if (curr.corrector.id === tempUid) {
            if (curr.comment) acc += curr.comment.length;
          } else {
            if (curr.feedback) acc += curr.feedback.length;
          }

          return acc;
        }, 0) / filtered.length,
      ),
    };
  }

  async getEvalInfos(args: GetEvalInfoArgs) {
    const tempData = await this.getTempData();
    const uid = 99947;

    let filtered = tempData;
    if (args.evalUserType === EvalUserEnum.CORRECTED) {
      filtered = tempData.filter(
        (curr: any) =>
          curr.correcteds.find((cur: any) => cur.id !== uid) !== undefined,
      );
    } else if (args.evalUserType === EvalUserEnum.CORRECTOR) {
      filtered = tempData.filter((curr: any) => curr.corrector.id === uid);
    }

    if (args.projectName) {
      filtered = filtered.filter((curr: any) =>
        curr.team.project_gitlab_path
          .toUpperCase()
          .includes(args.projectName?.toUpperCase()),
      );
    }

    if (args.targetUserName) {
      if (args.evalUserType === EvalUserEnum.CORRECTED) {
        filtered = filtered.filter(
          (curr: any) => curr.corrector.login === args.targetUserName,
        );
      } else if (args.evalUserType === EvalUserEnum.CORRECTOR) {
        filtered = filtered.filter((curr: any) =>
          curr.correcteds.find((cur: any) => cur.login === args.targetUserName),
        );
      } else {
        filtered = filtered.filter(
          (curr: any) =>
            curr.corrector.login === args.targetUserName ||
            curr.correcteds.find(
              (cur: any) => cur.login === args.targetUserName,
            ),
        );
      }
    }

    if (args.outstandingOnly) {
      filtered = filtered.filter((curr: any) => curr.flag.id === 9);
    }

    filtered = filtered.filter((curr: any) => curr.comment != null);

    return filtered;
  }

  async averageFinalMark(uid: number): Promise<number> {
    return this.scaleTeamService.getAverageFinalMark(uid);
  }

  async personalAverageFeedbackLength(uid: number): Promise<number> {
    return this.scaleTeamService.getAverageReviewLength('feedback', {
      'correcteds.id': uid,
    });
  }

  async currMonthCnt(uid: number): Promise<number> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);

    return this.scaleTeamService.getEvalCnt({
      'corrector.id': uid,
      beginAt: { $gte: startOfMonth },
    });
  }

  async lastMonthCnt(uid: number): Promise<number> {
    const currDate = Util.Time.currDate();

    const startOfMonth = Util.Time.startOfMonth(currDate);
    const startOfLastMonth = Util.Time.startOfLastMonth(currDate);

    return this.scaleTeamService.getEvalCnt({
      'corrector.id': uid,
      beginAt: {
        $gte: startOfLastMonth,
        $lt: startOfMonth,
      },
    });
  }

  async averageDuration(uid: number): Promise<number> {
    return this.scaleTeamService.getAverageDurationMinute({
      'corrector.id': uid,
    });
  }

  async evalInfos(args: GetEvalInfoArgs): Promise<PersonalScaleTeam[]> {
    return this.scaleTeamService.evalInfos(args);
  }
}
