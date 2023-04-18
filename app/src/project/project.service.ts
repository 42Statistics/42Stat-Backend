import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { project } from './db/project.database.schema';
import { ProjectPreview } from './models/project.preview';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(project.name)
    private projectModel: Model<project>,
  ) {}

  async find(
    filter: FilterQuery<project> = {},
    pageSize: number = -1,
    pageNumber: number = -1,
  ): Promise<project[]> {
    const query = this.projectModel.find(filter);

    if (pageNumber > 0) {
      query.skip(pageNumber);
    }

    if (pageSize > 0) {
      query.limit(pageSize);
    }

    return await query;
  }

  async findByName(name: string): Promise<project[]> {
    return await this.find({
      slug: { $regex: name, $options: 'i' },
    });
  }

  convertToPreview(project: project): ProjectPreview {
    return {
      id: project.id,
      name: project.name,
      url: `https://projects.intra.42.fr/${project.id}`,
    };
  }
}
