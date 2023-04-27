import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScaleTeamDocument = HydratedDocument<scale_team>;

export interface Languages {
  id: number;
  name: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flag {
  id: number;
  name: string;
  positive: boolean;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scale {
  id: number;
  evaluationId: number;
  name: string;
  is_primary: boolean;
  comment: string;
  introductionMd: string;
  disclaimerMd: string;
  guidelinesMd: string;
  createdAt: Date;
  correction_number: number;
  duration: number;
  manual_subscription: boolean;
  languages: Languages[];
  flags: Flag[];
  free: boolean;
}

export interface Team {
  id: number;
  name: string;
  url: string;
  finalMark?: number;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  terminatingAt?: Date;
  users: {
    id: number;
    login: string;
    url: string;
    leader: boolean;
    occurrence: number;
    validated: boolean;
    projects_userId: number;
  }[];
  locked: boolean;
  validated?: boolean;
  closed: boolean;
  repo_url: string;
  repo_uuid: number;
  lockedAt?: Date;
  closedAt?: Date;
  project_sessionId: number;
  project_gitlab_path: string;
}

export interface User {
  id: number;
  login: string;
  url: string;
}

export interface Feedback {
  id: number;
  user: User;
  feedbackableType: string;
  feedbackableId: number;
  comment: string;
  rating: number;
  createdAt: Date;
}

// todo: schema 로 다 바꾸기
@Schema()
export class scale_team {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  scaleId: number;

  @Prop()
  comment?: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop()
  feedback?: string;

  @Prop()
  finalMark?: number;

  @Prop({ required: true, type: Object })
  flag: Flag;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true, type: [Object] })
  correcteds: User[];

  @Prop({ required: true, type: Object })
  corrector: User;

  // todo
  @Prop({ required: false, type: Object })
  truant: object;

  @Prop()
  filledAt?: Date;

  @Prop({ required: false, type: [Object] })
  questions_withAnswers: object[];

  @Prop({ required: true, type: Object })
  scale: Scale;

  @Prop({ required: true, type: Object })
  team: Team;

  @Prop({ required: true, type: [Object] })
  feedbacks: Feedback[];
}

export const ScaleTeamSchema = SchemaFactory.createForClass(scale_team);
