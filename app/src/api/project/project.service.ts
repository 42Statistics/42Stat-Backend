import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { project } from './db/project.database.schema';
import { ProjectPreview } from './models/project.preview';

export const NETWHAT_PREVIEW: ProjectPreview = {
  id: 1318,
  name: 'netwhat',
  url: 'https://api.intra.42.fr/v2/projects/1318',
};

export const SEOUL_CAMPUS_ID = 29;

// todo: refactor all
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
    const result: Map<number, project> = new Map();

    const prefixMatches = await this.findAll({
      name: { $regex: `^${name}`, $options: 'i' },
    });

    prefixMatches.forEach((prefixMatch) =>
      result.set(prefixMatch.id, prefixMatch),
    );

    const matches = await this.findAll({
      name: { $regex: name, $options: 'i' },
    });

    matches.forEach((prefixMatch) => result.set(prefixMatch.id, prefixMatch));

    return [...result.values()];
  }

  convertToPreview(project: project): ProjectPreview {
    return {
      id: project.id,
      name: project.name,
      url: `https://projects.intra.42.fr/${project.id}`,
    };
  }
}
