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
import { API_CONFIG, type ApiConfig, projectUrlById } from 'src/config/api';
import { project } from './db/project.database.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  private readonly PROJECT_CIRCLES: Record<number, number>;

  constructor(
    @InjectModel(project.name)
    private readonly projectModel: Model<project>,
    private readonly configService: ConfigService,
  ) {
    this.PROJECT_CIRCLES =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).PROJECT_CIRCLES;
  }

  async findAllAndLean(queryArgs?: QueryArgs<project>): Promise<project[]> {
    return await findAllAndLean(queryArgs)(this.projectModel);
  }

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<project>,
  ): Promise<project | null> {
    return await findOneAndLean(queryOneArgs)(this.projectModel);
  }

  async findAllProjectPreviewAndLean(
    queryArgs?: Omit<QueryArgs<project>, 'select'>,
  ): Promise<ProjectPreview[]> {
    const projects: { id: number; name: string }[] = await this.findAllAndLean({
      ...queryArgs,
      select: {
        id: 1,
        name: 1,
      },
    });

    return projects.map((project) => ({
      ...project,
      url: projectUrlById(project.id),
      circle: this.PROJECT_CIRCLES[project.id],
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
    };

    const prefixMatches: Pick<ProjectPreview, 'id' | 'name'>[] =
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

    return [...result.values()].map((el) => ({
      ...el,
      circle: this.PROJECT_CIRCLES[el.id],
    }));
  }
}
