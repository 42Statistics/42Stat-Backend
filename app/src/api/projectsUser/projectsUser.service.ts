import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { ProjectRanking } from 'src/page/home/team/models/home.team.model';
import { projects_user } from './db/projectsUser.database.schema';

@Injectable()
export class ProjectsUserService {
  constructor(
    @InjectModel(projects_user.name)
    private projectsUserModel: Model<projects_user>,
  ) {}

  async currRegisteredCountRanking(
    limit: number,
    filter?: FilterQuery<projects_user>,
  ): Promise<ProjectRanking[]> {
    const aggregate = this.projectsUserModel.aggregate<ProjectRanking>();

    return await aggregate
      .match({ ...filter, status: 'in_progress' })
      .group({
        _id: '$project.id',
        name: { $first: '$project.name' },
        value: { $count: {} },
      })
      .project({
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
        value: '$value',
      })
      .sort({ value: -1 })
      .limit(limit);
  }
}
