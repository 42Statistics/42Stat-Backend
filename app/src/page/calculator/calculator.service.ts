import { Injectable } from '@nestjs/common';
import { level } from 'src/api/level/db/level.database.schema';
import { LevelService } from 'src/api/level/level.service';
import { ExpTable } from './models/calculator.model';

@Injectable()
export class CalculatorService {
  constructor(private readonly levelService: LevelService) {}

  async expTable(): Promise<ExpTable[]> {
    const expTable: Pick<level, 'lvl' | 'xp'>[] =
      await this.levelService.findAllAndLean({
        sort: { lvl: 1 },
        select: {
          lvl: 1,
          xp: 1,
        },
      });

    return expTable.map((exp) => ({
      level: exp.lvl,
      exp: exp.xp,
    }));
  }
}
