import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { ProjectRank } from 'src/page/home/team/models/home.team.model';
import { projects_user } from './db/projectsUser.database.schema';

@Injectable()
export class ProjectsUserService {
  constructor(
    @InjectModel(projects_user.name)
    private projectsUserModel: Model<projects_user>,
  ) {}

  // todo: limit 을 주기보단 pagination 방식으로 바꾸는게 더 적절해보임. 애초에 이 경우는 전부
  // 구해도 얼마 걸리지 않기 때문에 그냥 다 가져오는 것도 더 좋은 방법이 될 수 있음.
  async currRegisteredCountRanking(
    limit: number,
    filter?: FilterQuery<projects_user>,
  ): Promise<ProjectRank[]> {
    const aggregate = this.projectsUserModel.aggregate<ProjectRank>();

    return await aggregate
      .match({ ...filter, status: 'in_progress' })
      .group({
        _id: '$project.id',
        name: { $first: '$project.name' },
        value: { $count: {} },
      })
      .append({
        $setWindowFields: {
          sortBy: { value: -1 },
          output: {
            rank: { $rank: {} },
          },
        },
      })
      .project({
        _id: 0,
        projectPreview: {
          id: '$_id',
          name: '$name',
          url: {
            $concat: [
              'https://projects.intra.42.fr/projects/',
              { $toString: '$_id' },
            ],
          },
        },
        value: 1,
        rank: 1,
      })
      .limit(limit);
  }
}
