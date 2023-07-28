import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findAllAndLean,
  findOneAndLean,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import type { ProjectPreview } from 'src/common/models/common.project.model';
import { projectUrlById } from 'src/config/api';
import { project } from './db/project.database.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(project.name)
    private readonly projectModel: Model<project>,
  ) {}

  async findAllAndLean(queryArgs?: QueryArgs<project>): Promise<project[]> {
    return await findAllAndLean(this.projectModel, queryArgs);
  }

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<project>,
  ): Promise<project | null> {
    return await findOneAndLean(this.projectModel, queryOneArgs);
  }

  async findOneProjectPreviewAndLean(
    queryArgs?: Omit<QueryArgs<project>, 'select'>,
  ): Promise<ProjectPreview | null> {
    const project: Pick<project, 'id' | 'name' | 'circle'> | null =
      await this.findOneAndLean({
        ...queryArgs,
        select: {
          id: 1,
          name: 1,
          circle: 1,
        },
      });

    return project
      ? {
          ...project,
          url: projectUrlById(project.id),
        }
      : null;
  }

  async findAllProjectPreviewAndLean(
    queryArgs?: Omit<QueryArgs<project>, 'select'>,
  ): Promise<ProjectPreview[]> {
    const projects: { id: number; name: string; circle?: number }[] =
      await this.findAllAndLean({
        ...queryArgs,
        select: {
          id: 1,
          name: 1,
          circle: 1,
        },
      });

    return projects.map((project) => ({
      ...project,
      url: projectUrlById(project.id),
    }));
  }

  // todo: deprecated at v0.6.0
  async findProjectPreviewByName(
    name: string,
    limit: number,
  ): Promise<ProjectPreview[]> {
    const result: Map<number, ProjectPreview> = new Map();

    const escapedName = name.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

    const previewProjection = {
      id: 1,
      name: 1,
      circle: 1,
    };

    const prefixMatches: Pick<ProjectPreview, 'id' | 'name' | 'circle'>[] =
      await this.findAllAndLean({
        filter: { name: new RegExp(`^${escapedName}`, 'i') },
        select: previewProjection,
        limit,
      });

    prefixMatches.forEach((project) =>
      result.set(project.id, {
        id: project.id,
        name: project.name,
        url: projectUrlById(project.id),
      }),
    );

    if (prefixMatches.length < limit) {
      const matches: Pick<ProjectPreview, 'id' | 'name'>[] =
        await this.findAllAndLean({
          filter: { name: new RegExp(`.${escapedName}`, 'i') },
          select: previewProjection,
          limit,
        });

      matches.forEach((project) =>
        result.set(project.id, {
          id: project.id,
          name: project.name,
          url: projectUrlById(project.id),
        }),
      );
    }

    return [...result.values()];
  }
}
