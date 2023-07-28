import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { addRank } from 'src/common/db/common.db.aggregation';
import { findAllAndLean, type QueryArgs } from 'src/common/db/common.db.query';
import { API_CONFIG, type ApiConfig } from 'src/config/api';
import type { ProjectRank } from 'src/page/home/team/models/home.team.model';
import { DateWrapper } from 'src/statDate/StatDate';
import { concatProjectUrl } from '../project/db/project.database.aggregate';
import { projects_user } from './db/projectsUser.database.schema';

@Injectable()
export class ProjectsUserService {
  private readonly PROJECT_CIRCLES: Record<number, number>;

  constructor(
    @InjectModel(projects_user.name)
    private readonly projectsUserModel: Model<projects_user>,
    private readonly configService: ConfigService,
  ) {
    this.PROJECT_CIRCLES =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).PROJECT_CIRCLES;
  }

  async findAllAndLean(
    queryArgs?: QueryArgs<projects_user>,
  ): Promise<projects_user[]> {
    return await findAllAndLean(queryArgs)(this.projectsUserModel);
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
        name: { $first: '$project.name' },
        value: { $count: {} },
      })
      .append(addRank())
      .project({
        _id: 0,
        projectPreview: {
          id: '$_id',
          name: '$name',
          url: { ...concatProjectUrl('_id') },
        },
        value: 1,
        rank: 1,
      })
      .limit(limit)
      .then((projectRanking) =>
        projectRanking.map((projectRank) => ({
          ...projectRank,
          projectPreview: {
            ...projectRank.projectPreview,
            circle: this.PROJECT_CIRCLES[projectRank.projectPreview.id],
          },
        })),
      );
  }
}
