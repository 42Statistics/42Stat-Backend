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

  async findAll(filter: FilterQuery<project> = {}): Promise<project[]> {
    return await this.projectModel.find(filter);
  }

  async findByName(name: string): Promise<project[]> {
    return await this.findAll({
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
