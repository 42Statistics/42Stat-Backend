import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { CDN_CONFIG, type CdnConfig } from 'src/config/cdn';
import { project } from './db/project.database.schema';

@Injectable()
export class ProjectService {
  private readonly pdfCdn: string;

  constructor(
    @InjectModel(project.name)
    private readonly projectModel: Model<project>,
    private readonly configService: ConfigService,
  ) {
    this.pdfCdn = this.configService.getOrThrow<CdnConfig>(CDN_CONFIG).PDF;
  }

  pdfUrlByIdAndName(id: number, name: string): string {
    return `${this.pdfCdn}/${id}/${name}.pdf`;
  }

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
