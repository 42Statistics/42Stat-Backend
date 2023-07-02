import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ProjectSessionInfo } from 'src/page/projectInfo/models/projectInfo.model';
import { SEOUL_CAMPUS_ID } from '../project/project.service';
import { lookupProjectSessionsSkill } from '../projectSessionsSkill/db/projectSessionsSkill.database.aggregate';
import { lookupSkill } from '../skill/db/skill.database.aggregate';
import {
  ProjectSessionRule,
  project_session,
} from './db/projectSession.database.schema';

@Injectable()
export class ProjectSessionService {
  constructor(
    @InjectModel(project_session.name)
    private projectSessionModel: Model<project_session>,
  ) {}

  async projectSessionInfo(projectId: number): Promise<ProjectSessionInfo> {
    const aggregate = this.projectSessionModel.aggregate<
      ProjectSessionInfo & {
        projectSessionsRules: ProjectSessionRule[];
      }
    >();

    const [projectSessionInfo] = await aggregate
      .match({
        $or: [{ 'campus.id': SEOUL_CAMPUS_ID }, { campus: null }],
        'project.id': projectId,
      })
      .sort({ 'campus.id': -1 })
      .append(lookupProjectSessionsSkill('id', 'projectSessionId'))
      .append(lookupSkill('project_sessions_skills.skillId', 'id'))
      .project({
        projectSessionsRules: 1,
        objectives: 1,
        skills: '$skills.name',
        description: '$description',
        estimateTime: '$estimateTime',
        difficulty: '$difficulty',
      });

    if (!projectSessionInfo) {
      throw new NotFoundException();
    }

    const [minUserCount, maxUserCount] = teamUserCount(
      projectSessionInfo.projectSessionsRules,
    );

    return {
      objectives: projectSessionInfo.objectives ?? [],
      skills: projectSessionInfo.skills ?? [],
      description: projectSessionInfo.description,
      estimateTime: projectSessionInfo.estimateTime,
      difficulty: projectSessionInfo.difficulty,
      minUserCount,
      maxUserCount,
    };
  }
}

const teamUserCount = (
  projectSessionsRules: ProjectSessionRule[],
): [number, number] => {
  const groupValidationRule = projectSessionsRules.filter(
    (projectSessionsRule) => projectSessionsRule.rule.id === 3,
  );

  const params = groupValidationRule.at(0)?.params;

  if (params) {
    return [parseInt(params[0].value), parseInt(params[1].value)];
  }

  return [1, 1];
};
