import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { addRank } from 'src/database/mongoose/database.mongoose.aggregation';
import {
  findAllAndLean,
  type QueryArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { ProjectRank } from 'src/page/home/team/models/home.team.model';
import {
  concatProjectUrl,
  lookupProjects,
} from '../project/db/project.database.aggregate';
import { projects_user } from './db/projectsUser.database.schema';

@Injectable()
export class ProjectsUserService {
  constructor(
    @InjectModel(projects_user.name)
    private readonly projectsUserModel: Model<projects_user>,
  ) {}

  async findAllAndLean(
    queryArgs?: QueryArgs<projects_user>,
  ): Promise<projects_user[]> {
    return await findAllAndLean(this.projectsUserModel, queryArgs);
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
        createdAt: { $gte: new DateWrapper().moveMonth(-4).toDate() },
      })
      .group({
        _id: '$project.id',
        value: { $count: {} },
      })
      .append(addRank())
      .limit(limit)
      .append(lookupProjects('_id', 'id'))
      .project({
        _id: 0,
        projectPreview: {
          id: '$_id',
          name: { $first: '$projects.name' },
          url: concatProjectUrl('_id'),
          circle: { $first: '$projects.circle' },
        },
        value: 1,
        rank: 1,
      });
  }
}
