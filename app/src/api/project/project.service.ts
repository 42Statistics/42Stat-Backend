import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { project } from './db/project.database.schema';
import { ProjectPreview } from './models/project.preview';
import { lookupProjectSession } from '../projectSession/db/projectSession.database.aggregate';

export const NETWHAT_PREVIEW: ProjectPreview = {
  id: 1318,
  name: 'netwhat',
  url: 'https://api.intra.42.fr/v2/projects/1318',
};

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

  async projectSessionsInfo(projectName: string): Promise<{
    id: number;
    name: string;
    skills: string[];
    description: string;
    duration: number | null;
    difficulty: number;
  }> {
    const aggregate = this.projectModel.aggregate<{
      id: number;
      name: string;
      skills: string[];
      description: string;
      duration: number | null;
      difficulty: number;
    }>();

    const [projectSessionsInfo] = await aggregate
      .match({
        name: { $regex: 'webserv' },
      })
      .lookup({
        from: 'project_sessions',
        localField: 'id',
        foreignField: 'projectId',
        as: 'project_sessions',
        pipeline: [{ $match: { campusId: 29 } }], //todo: lookup 만들기, sessions에서의 findOne 만들기
      })
      .lookup({
        from: 'project_sessions_skills',
        localField: 'project_sessions.id',
        foreignField: 'projectSessionId',
        as: 'project_sessions_skills',
      })
      .lookup({
        from: 'skills',
        localField: 'project_sessions_skills.skillId',
        foreignField: 'id',
        as: 'skills',
      })
      .project({
        id: 1,
        name: 1,
        skills: '$skills.name',
        description: { $first: '$projectSessions.description' },
        duration: { $first: '$projectSessions.durationDays' },
        difficulty: { $first: '$projectSessions.difficulty' },
      });

    return projectSessionsInfo;
  }

  async teamMemberCount(projectName: string): Promise<{
    minUserCount: number;
    maxUserCount: number;
  }> {
    const aggregate = this.projectModel.aggregate<{
      minUserCount: number;
      maxUserCount: number;
    }>();

    const [teamMemberCount] = await aggregate
      .match({
        name: { $regex: 'webserv' },
      })
      .append(
        lookupProjectSession('id', 'projectId', [{ $match: { campusId: 29 } }]),
      )
      .unwind({
        path: '$project_sessions',
      })
      .unwind({
        path: '$project_sessions.projectSessionsRules',
      })
      .match({
        'project_sessions.projectSessionsRules.rule.id': 3,
      })
      .addFields({
        minUserCount: {
          $toInt: {
            $first: '$project_sessions.projectSessionsRules.params.value',
          },
        },
        maxUserCount: {
          $toInt: {
            $last: '$project_sessions.projectSessionsRules.params.value',
          },
        },
      })
      .project({
        minUserCount: 1,
        maxUserCount: 1,
      });

    return teamMemberCount;
  }
}
