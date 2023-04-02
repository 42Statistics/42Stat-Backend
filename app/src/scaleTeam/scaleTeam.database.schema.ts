import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScaleTeamDocument = HydratedDocument<ScaleTeam>;

export interface Languages {
  id: number;
  name: string;
  identifier: string;
  created_at: string;
  updated_at: string;
}

export interface Flag {
  id: number;
  name: string;
  positive: boolean;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Scale {
  id: number;
  evaluation_id: number;
  name: string;
  is_primary: boolean;
  comment: string;
  introduction_md: string;
  disclaimer_md: string;
  guidelines_md: string;
  created_at: string;
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
  final_mark: number | null;
  project_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  terminating_at: string | null;
  users: {
    id: number;
    login: string;
    url: string;
    leader: boolean;
    occurrence: number;
    validated: boolean;
    projects_user_id: number;
  }[];
  locked: boolean;
  validated: boolean | null;
  closed: boolean;
  repo_url: string;
  repo_uuid: string;
  locked_at: string | null;
  closed_at: string | null;
  project_session_id: number;
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
  feedbackable_type: string;
  feedbackable_id: number;
  comment: string;
  rating: number;
  created_at: string;
}

@Schema()
export class ScaleTeam {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  scale_id: number;

  @Prop({ required: true, type: String })
  comment: string | null;

  @Prop({ required: true })
  created_at: string;

  @Prop({ required: true })
  updated_at: string;

  @Prop({ required: true, type: String })
  feedback: string | null;

  @Prop({ required: true, type: Number })
  final_mark: number | null;

  @Prop({ required: true, type: Object })
  flag: Flag;

  @Prop({ required: true })
  begin_at: string;

  @Prop({ required: true, type: [Object] })
  correcteds: User[];

  @Prop({ required: true, type: Object })
  corrector: User;

  @Prop({ required: false, type: Object })
  truant: Object;

  @Prop({ required: true, type: String })
  filled_at: string | null;

  @Prop({ required: false, type: [Object] })
  questions_with_answers: Object[];

  @Prop({ required: true, type: Object })
  scale: Scale;

  @Prop({ required: true, type: Object })
  team: Team;

  @Prop({ required: true, type: [Object] })
  feedbacks: Feedback[];
}

export const ScaleTeamSchema = SchemaFactory.createForClass(ScaleTeam);
