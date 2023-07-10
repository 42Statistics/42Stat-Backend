import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { addRank } from 'src/common/db/common.db.aggregation';
import { findAll, type QueryArgs } from 'src/common/db/common.db.query';
import type { ProjectRank } from 'src/page/home/team/models/home.team.model';
import { StatDate } from 'src/statDate/StatDate';
import { PROJECT_BASE_URL } from '../project/project.service';
import {
  projects_user,
  type ProjectsUserDocument,
} from './db/projectsUser.database.schema';

@Injectable()
export class ProjectsUserService {
  constructor(
    @InjectModel(projects_user.name)
    private projectsUserModel: Model<projects_user>,
  ) {}

  async findAll(
    queryArgs?: QueryArgs<projects_user>,
  ): Promise<ProjectsUserDocument[]> {
    return await findAll(queryArgs)(this.projectsUserModel);
  }

  // todo: limit 을 주기보단 pagination 방식으로 바꾸는게 더 적절해보임. 애초에 이 경우는 전부
  // 구해도 얼마 걸리지 않기 때문에 그냥 다 가져오는 것도 더 좋은 방법이 될 수 있음.
  async currRegisteredCountRanking(
    limit: number,
    filter?: FilterQuery<projects_user>,
  ): Promise<ProjectRank[]> {
    const aggregate = this.projectsUserModel.aggregate<ProjectRank>();

    return await aggregate
      .match({
        ...filter,
        status: 'in_progress',
        createdAt: { $gte: new StatDate().moveMonth(-4) },
      })
      .group({
        _id: '$project.id',
        name: { $first: '$project.name' },
        value: { $count: {} },
      })
      .append(addRank())
      .project({
        _id: 0,
        projectPreview: {
          id: '$_id',
          name: '$name',
          url: {
            $concat: [PROJECT_BASE_URL, '/', { $toString: '$_id' }],
          },
        },
        value: 1,
        rank: 1,
      })
      .limit(limit);
  }
}
