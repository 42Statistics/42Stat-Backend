import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { EvalUserEnum, GetEvalInfoArgs } from './dto/getEvalInfo.args';

@Injectable()
export class PersonalEvalService {
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

  async getSummaryByUid(uid: string) {
    const tempData = await this.getTempData();

    const tempUid = parseInt(uid);

    const filtered = tempData.filter(
      (curr: any) =>
        curr.corrector.id === tempUid ||
        curr.correcteds.find((corrected: any) => corrected.id === tempUid) !== undefined,
    );

    const currMonth = new Date('2023-02-01T00:00:00.000Z').getTime();
    const lastMonth = new Date('2023-01-01T00:00:00.000Z').getTime();

    const totalEval = filtered.filter((curr: any) => curr.corrector.id === tempUid);

    const result = totalEval.reduce(
      (acc: [number, number], curr: any) => {
        if (curr.filled_at && curr.begin_at) {
          acc[0] += (new Date(curr.filled_at).getTime() - new Date(curr.begin_at).getTime()) / 1000 / 60;
          acc[1] += curr.final_mark;
        }

        return acc;
      },
      [0, 0],
    );

    const evaluateLast = tempData.filter((curr: any) => {
      return (
        curr.corrector.id === tempUid &&
        new Date(curr.begin_at).getTime() >= lastMonth &&
        new Date(curr.begin_at).getTime() < currMonth
      );
    });

    const evaluateThis = tempData.filter(
      (curr: any) => curr.corrector.id === tempUid && new Date(curr.begin_at).getTime() >= currMonth,
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
    const uid = '99947';

    let filtered = tempData;
    if (args.evalUserType === EvalUserEnum.CORRECTED) {
      filtered = tempData.filter((curr: any) => curr.correcteds.find((cur: any) => cur.id !== uid) !== undefined);
    } else if (args.evalUserType === EvalUserEnum.CORRECTOR) {
      filtered = tempData.filter((curr: any) => curr.corrector.id === uid);
    }

    if (args.subjectName) {
      filtered = filtered.filter((curr: any) =>
        curr.team.project_gitlab_path.toUpperCase().includes(args.subjectName?.toUpperCase()),
      );
    }

    if (args.targetUserName) {
      if (args.evalUserType === EvalUserEnum.CORRECTED) {
        filtered = filtered.filter((curr: any) => curr.corrector.login === args.targetUserName);
      } else if (args.evalUserType === EvalUserEnum.CORRECTOR) {
        filtered = filtered.filter((curr: any) =>
          curr.correcteds.find((cur: any) => cur.login === args.targetUserName),
        );
      } else {
        filtered = filtered.filter(
          (curr: any) =>
            curr.corrector.login === args.targetUserName ||
            curr.correcteds.find((cur: any) => cur.login === args.targetUserName),
        );
      }
    }

    if (args.outstandingOnly) {
      filtered = filtered.filter((curr: any) => curr.flag.id === 9);
    }

    filtered = filtered.filter((curr: any) => curr.comment != null);

    return filtered;
  }
}
