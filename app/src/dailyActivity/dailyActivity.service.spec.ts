import { Test } from '@nestjs/testing';
import {
  DailyActivityType,
  type FindDailyActivityDetailRecordOutput,
} from './dailyActivity.dto';
import { DailyActivityService } from './dailyActivity.service';
import { DailyActivityDaoImpl } from './db/dailyActivity.database.dao';

describe(DailyActivityService.name, () => {
  let dailyActivityService: DailyActivityService;

  describe('userDailyActivityDetailRecordsById', () => {
    const testUser = 1;
    const testIdsWithType: {
      id: number;
      type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;
    }[] = [
      {
        id: 2,
        type: DailyActivityType.CORRECTOR,
      },
      {
        id: 3,
        type: DailyActivityType.CORRECTED,
      },
      {
        id: 1,
        type: DailyActivityType.EVENT,
      },
    ];

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [DailyActivityService],
      })
        .useMocker((token) => {
          if (token === DailyActivityDaoImpl) {
            return {
              findAllRecordByDate: () => {},
              findAllDetailRecordByDate:
                (): FindDailyActivityDetailRecordOutput[] => {
                  return [
                    {
                      type: DailyActivityType.CORRECTOR,
                      // 정렬될 index를 id 로 사용
                      id: 2,
                      correctorLogin: 'corrector',
                      teamId: 1,
                      leaderLogin: 'leader1',
                      projectName: 'project',
                      beginAt: new Date('2021-01-01T20:00:00.000Z'),
                      filledAt: new Date('2021-01-01T21:00:00.000Z'),
                    },
                    {
                      type: DailyActivityType.CORRECTED,
                      id: 3,
                      correctorLogin: 'corrected',
                      teamId: 2,
                      leaderLogin: 'leader2',
                      projectName: 'project',
                      beginAt: new Date('2021-01-01T18:00:00.000Z'),
                      filledAt: new Date('2021-01-01T22:00:00.000Z'),
                    },
                    {
                      type: DailyActivityType.EVENT,
                      id: 1,
                      name: 'event',
                      location: 'location',
                      beginAt: new Date('2021-01-01T16:00:00.000Z'),
                      endAt: new Date('2021-01-01T17:00:00.000Z'),
                    },
                  ];
                },
            };
          }
        })
        .compile();

      dailyActivityService = moduleRef.get(DailyActivityService);
    });

    it('DailyActivityDetailRecordUnion[] 을 반환함', async () => {
      const result =
        await dailyActivityService.userDailyActivityDetailRecordsById(
          testUser,
          testIdsWithType,
        );

      result.forEach((curr) => {
        switch (curr.type) {
          case DailyActivityType.EVENT:
            expect(typeof curr.id === 'number').toBe(true);
            expect(typeof curr.name === 'string').toBe(true);
            expect(typeof curr.location === 'string').toBe(true);
            expect(isNaN(curr.beginAt.getTime())).toBe(false);
            expect(isNaN(curr.endAt.getTime())).toBe(false);
            break;
          case DailyActivityType.CORRECTOR:
          case DailyActivityType.CORRECTED:
            expect(typeof curr.id === 'number').toBe(true);
            expect(typeof curr.correctorLogin === 'string').toBe(true);
            expect(typeof curr.teamId === 'number').toBe(true);
            expect(typeof curr.leaderLogin === 'string').toBe(true);
            expect(typeof curr.projectName === 'string').toBe(true);
            expect(isNaN(curr.beginAt.getTime())).toBe(false);
            expect(isNaN(curr.filledAt.getTime())).toBe(false);
            break;
          default:
            expect(1).toBe(2);
        }
      });
    });

    it('logtime 을 첫번째로, 나머지는 끝난 시간순으로 정렬하여 반환함', async () => {
      const result =
        await dailyActivityService.userDailyActivityDetailRecordsById(
          testUser,
          testIdsWithType,
        );

      result.forEach((curr, index) => {
        expect(curr.id - 1).toBe(index);
      });
    });
  });
});
