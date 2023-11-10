import { Test } from '@nestjs/testing';
import {
  UserLogtimeRecordByDateRangeOutput,
  UserLogtimeRecordsByDateRangeInput,
} from './dailyLogtime.dto';
import { DailyLogtimeService } from './dailyLogtime.service';
import { DailyLogtimeDaoImpl } from './db/dailyLogtime.database.dao';

describe(DailyLogtimeService.name, () => {
  let dailyLogtimeService: DailyLogtimeService;
  const testExistUserId = 1;
  const testDateRange = {
    start: new Date('2021-01-01T15:00:00.000Z'),
    end: new Date('2021-02-31T15:00:00.000Z'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DailyLogtimeService],
    })
      .useMocker((token) => {
        if (token === DailyLogtimeDaoImpl) {
          return {
            userLogtimeRecordsByDateRange: (
              args: UserLogtimeRecordsByDateRangeInput,
            ): UserLogtimeRecordByDateRangeOutput[] => {
              if (args.userId !== testExistUserId) {
                return [];
              }

              return [
                {
                  yearMonth: '2021-01',
                  value: 1,
                },
                {
                  yearMonth: '2021-02',
                  value: 2,
                },
              ];
            },
          };
        }
      })
      .compile();

    dailyLogtimeService = moduleRef.get(DailyLogtimeService);
  });

  it('반환 타입이 IntRecord[] 인지 확인한다.', async () => {
    const result = await dailyLogtimeService.userLogtimeRecordsByDateRange(
      testExistUserId,
      testDateRange,
    );

    result.forEach((curr) => {
      expect(isNaN(curr.at.getTime())).toBe(false);
      expect(typeof curr.value === 'number').toBe(true);
    });
  });
});
