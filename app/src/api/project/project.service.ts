import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { QueryArgs } from 'src/common/db/common.db.query';
import { ProjectDocument, project } from './db/project.database.schema';
import type { ProjectPreview } from './models/project.preview';

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

  async findAll({
    filter,
    sort,
    limit,
    select,
    skip,
  }: QueryArgs<project>): Promise<ProjectDocument[]> {
    const query = this.projectModel.find(filter ?? {});

    if (sort) {
      query.sort(sort);
    }

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }

    if (select) {
      query.select(select);
    }

    return await query;
  }

  async findOne(filter?: FilterQuery<project>): Promise<ProjectDocument> {
    const project = await this.projectModel.findOne({ filter });

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  async findByName(name: string): Promise<project[]> {
    const result: Map<number, project> = new Map();

    const escapedName = name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

    const prefixMatches = await this.findAll({
      filter: { name: new RegExp(`^${escapedName}`, 'i') },
    });

    prefixMatches.forEach((prefixMatch) =>
      result.set(prefixMatch.id, prefixMatch),
    );

    const matches = await this.findAll({
      filter: { name: new RegExp(escapedName, 'i') },
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
