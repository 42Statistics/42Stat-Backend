import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, FilterQuery, Model } from 'mongoose';
import {
  ProjectSessionInfo,
  TeamMemberCount,
} from 'src/page/projectInfo/models/projectInfo.model';
import { SEOUL_CAMPUS_ID } from '../project/project.service';
import {
  ProjectSerssionDocument,
  project_session,
} from './db/projectSession.database.schema';

@Injectable()
export class projectSessionService {
  constructor(
    @InjectModel(project_session.name)
    private projectSessionModel: Model<project_session>,
  ) {}

  async findOneByCampusId(
    campusId: number,
    filter: FilterQuery<project_session> = {},
  ): Promise<ProjectSerssionDocument> {
    const [projectSession] = await this.projectSessionModel
      .find({ $or: [{ campusId: campusId }, { campusId: null }] }, filter)
      .sort({ campusId: -1 });

    if (!projectSession) {
      throw new NotFoundException();
    }

    return projectSession;
  }

  findOneAggregateByCampusId(
    campusId: number,
    filter: FilterQuery<project_session> = {},
  ): Aggregate<any> {
    //todo: aggregate type
    const aggregate = this.projectSessionModel.aggregate();

    aggregate
      .match({ $or: [{ campusId: campusId }, { campusId: null }] })
      .match(filter)
      .sort({ campusId: -1 })
      .limit(1);

    return aggregate;
  }

  async findOneByProjectId(
    projectId: number,
  ): Promise<ProjectSerssionDocument> {
    return await this.findOneByCampusId(SEOUL_CAMPUS_ID, {
      projectId: projectId,
    });
  }

  //todo: 방식 정하기
  async projectSessionInfo(projectId: number): Promise<ProjectSessionInfo> {
    //const aggregate = this.projectSessionModel.aggregate<ProjectSessionInfo>();

    const aggregate = this.findOneAggregateByCampusId(SEOUL_CAMPUS_ID, {
      projectId: projectId,
    });

    const [projectSessionInfo] = await aggregate
      //.match({ $or: [{ campusId: SEOUL_CAMPUS_ID }, { campusId: null }] })
      //.match({ projectId: projectId })
      //.sort({ campusId: -1 })
      .lookup({
        from: 'project_sessions_skills',
        localField: 'id',
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
        campusId: 1,
        skills: '$skills.name',
        description: '$description',
        estimateTime: '$estimateTime',
        difficulty: '$difficulty',
      });

    return projectSessionInfo;
  }

  async teamMemberCount(projectId: number): Promise<TeamMemberCount> {
    const aggregate = this.findOneAggregateByCampusId(SEOUL_CAMPUS_ID, {
      projectId: projectId,
    });

    const [teamMemberCount] = await aggregate
      .unwind({ path: '$projectSessionsRules' })
      .match({ 'projectSessionsRules.rule.id': 3 })
      .addFields({
        minUserCount: {
          $toInt: { $first: '$projectSessionsRules.params.value' },
        },
        maxUserCount: {
          $toInt: { $last: '$projectSessionsRules.params.value' },
        },
      })
      .project({
        minUserCount: 1,
        maxUserCount: 1,
      });

    return teamMemberCount ?? { minUserCount: 1, maxUserCount: 1 };
  }
}
