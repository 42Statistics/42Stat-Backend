import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findAllAndLean,
  findOneAndLean,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/database/mongoose/database.mongoose.query';
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
    const projects: Pick<project, 'id' | 'name' | 'circle'>[] =
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
}
