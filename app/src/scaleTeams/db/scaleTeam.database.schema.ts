import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface Languages {
  id: number;
  name: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flag {
  id: number;
  name: string;
  positive: boolean;
  icon: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
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
  finalMark: number | null;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  terminatingAt: string | null;
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
  validated: boolean | null;
  closed: boolean;
  repo_url: string;
  repo_uuid: number;
  lockedAt: string | null;
  closedAt: string | null;
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
  createdAt: string;
}

@Schema()
export class scale_teams {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  scaleId: number;

  @Prop({ required: true, type: String })
  comment: string | null;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;

  @Prop({ required: true, type: String })
  feedback: string | null;

  @Prop({ required: true, type: Number })
  finalMark: number | null;

  @Prop({ required: true, type: Object })
  flag: Flag;

  @Prop({ required: true })
  beginAt: string;

  @Prop({ required: true, type: [Object] })
  correcteds: User[];

  @Prop({ required: true, type: Object })
  corrector: User;

  @Prop({ required: false, type: Object })
  truant: object;

  @Prop({ required: true, type: String })
  filledAt: string | null;

  @Prop({ required: false, type: [Object] })
  questions_withAnswers: object[];

  @Prop({ required: true, type: Object })
  scale: Scale;

  @Prop({ required: true, type: Object })
  team: Team;

  @Prop({ required: true, type: [Object] })
  feedbacks: Feedback[];
}

export const ScaleTeamSchema = SchemaFactory.createForClass(scale_teams);
