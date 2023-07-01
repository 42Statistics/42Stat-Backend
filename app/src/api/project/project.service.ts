import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findAll,
  findOne,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
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

  async findAll(queryArgs?: QueryArgs<project>): Promise<ProjectDocument[]> {
    return await findAll(queryArgs)(this.projectModel);
  }

  async findOne(queryOneArgs: QueryOneArgs<project>): Promise<ProjectDocument> {
    const project = await findOne(queryOneArgs)(this.projectModel);

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  async findProjectPreviewByName(
    name: string,
    limit: number,
  ): Promise<ProjectPreview[]> {
    const result: Map<number, ProjectPreview> = new Map();

    const escapedName = name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

    const previewProjection = {
      id: 1,
      name: 1,
    };

    const prefixMatches: Pick<ProjectPreview, 'id' | 'name'>[] =
      await this.findAll({
        filter: { name: new RegExp(`^${escapedName}`, 'i') },
        select: previewProjection,
        limit,
      });

    prefixMatches.forEach((project) =>
      result.set(project.id, {
        id: project.id,
        name: project.name,
        url: `https://projects.intra.42.fr/${project.id}`,
      }),
    );

    if (prefixMatches.length < limit) {
      const matches: Pick<ProjectPreview, 'id' | 'name'>[] = await this.findAll(
        {
          filter: { name: new RegExp(`.${escapedName}`, 'i') },
          select: previewProjection,
          limit,
        },
      );

      matches.forEach((project) =>
        result.set(project.id, {
          id: project.id,
          name: project.name,
          url: `https://projects.intra.42.fr/${project.id}`,
        }),
      );
    }

    return [...result.values()];
  }
}
