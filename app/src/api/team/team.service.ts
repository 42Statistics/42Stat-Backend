import { Inject, Injectable } from '@nestjs/common';
import { team } from './db/team.database.schema';
import { FilterQuery, Model } from 'mongoose';
import { AggrNumeric } from 'src/common/db/common.db.aggregation';

@Injectable()
export class TeamService {
  constructor(
    @Inject(team.name)
    private teamModel: Model<team>,
  ) {}

  async teamCount(filter?: FilterQuery<team>): Promise<number> {
    if (!filter) {
      return await this.teamModel.estimatedDocumentCount();
    }

    return await this.teamModel.countDocuments(filter);
  }

  /**
   *
   * @return number[] 0번째에 pass, 1번째에 fail 숫자를 담은 배열을 반환합니다.
   */
  async teamResult(filter?: FilterQuery<team>): Promise<[number, number]> {
    const aggregate = this.teamModel.aggregate<
      { _id: 'true' | 'false' } & AggrNumeric
    >();

    const teamResultAggr = await aggregate
      .match({ ...filter, status: 'finished' })
      .group({ _id: '$validated?', value: { $count: {} } });

    const pass = teamResultAggr.find(({ _id }) => _id === 'true')?.value ?? 0;
    const fail = teamResultAggr.find(({ _id }) => _id === 'false')?.value ?? 0;

    return [pass, fail];
  }

  async registeredCount(filter?: FilterQuery<team>): Promise<number> {
    const aggregate = this.teamModel.aggregate<AggrNumeric>();

    if (filter) {
      aggregate.match(filter);
    }

    const registeredCountAggr = await aggregate.group({
      _id: 'result',
      value: { $sum: { $size: '$users' } },
    });

    return registeredCountAggr.length ? registeredCountAggr[0].value : 0;
  }

  async teamMatesUid(
    targetUid: number,
  ): Promise<{ uid: number; value: number }[]> {
    const aggregate = this.teamModel.aggregate<{ uid: number } & AggrNumeric>();

    return await aggregate
      .match({ 'users.id': targetUid })
      .unwind({ path: 'users' })
      .group({ _id: '$users.id', value: { $count: {} } })
      .match({ _id: { $ne: targetUid } })
      .project({ _id: 0, uid: '$_id', value: 1 });
  }
}
