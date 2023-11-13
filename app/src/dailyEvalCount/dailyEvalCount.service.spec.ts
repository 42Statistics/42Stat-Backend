import { Test } from '@nestjs/testing';
import type { FindEvalCountByDateOutput } from './dailyEvalCount.dto';
import { DailyEvalCountService } from './dailyEvalCount.service';
import {
  DailyEvalCountDaoImpl,
  type DailyEvalCountDao,
} from './db/dailyEvalCount.database.dao';

describe(DailyEvalCountService.name, () => {
  let dailyEvalCountService: DailyEvalCountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DailyEvalCountService],
    })
      .useMocker((token) => {
        if (token === DailyEvalCountDaoImpl) {
          return {
            findEvalCountsByDate: async ({
              start,
              end,
            }): Promise<FindEvalCountByDateOutput[]> => {
              return [
                {
                  date: new Date('2022-12-31T15:00:00.000Z'),
                  count: 1,
                },
                {
                  date: new Date('2023-01-31T15:00:00.000Z'),
                  count: 2,
                },
                {
                  date: new Date('2023-06-31T15:00:00.000Z'),
                  count: 3,
                },
                {
                  date: new Date('2024-05-31T15:00:00.000Z'),
                  count: 4,
                },
              ].filter(({ date }) => date >= start && date <= end);
            },
            findUserEvalCountsByDatePerMonth: async ({
              start,
              end,
            }): Promise<FindEvalCountByDateOutput[]> => {
              return [
                {
                  date: new Date('2022-12-31T15:00:00.000Z'),
                  count: 1,
                },
                {
                  date: new Date('2023-01-31T15:00:00.000Z'),
                  count: 2,
                },
                {
                  date: new Date('2023-06-31T15:00:00.000Z'),
                  count: 3,
                },
                {
                  date: new Date('2024-05-31T15:00:00.000Z'),
                  count: 4,
                },
              ].filter(({ date }) => date >= start && date <= end);
            },
          } satisfies DailyEvalCountDao;
        }
      })
      .compile();

    dailyEvalCountService = moduleRef.get<DailyEvalCountService>(
      DailyEvalCountService,
    );
  });

  describe('evalCountRecordsByDate', () => {
    const testDate = {
      start: new Date('2022-12-31T15:00:00.000Z'),
      end: new Date('2023-12-31T15:00:00.000Z'),
    };

    it('should return eval count records', async () => {
      const evalCountRecords =
        await dailyEvalCountService.evalCountRecordsByDate(testDate);

      evalCountRecords.forEach(({ at, value }) => {
        expect(isNaN(new Date(at).getTime())).toBe(false);
        expect(typeof value).toBe('number');
      });
    });
  });
});
