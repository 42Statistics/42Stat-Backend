import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EvalLogDocument = HydratedDocument<EvalLog>;

export interface Flag {
  id: number;
  name: string;
  positive: boolean;
}

export interface Scale {
  id: number;
  evaluation_id: number;
  //?name?
  is_primary: boolean;
  comment: string;
  created_at: string;
  correction_number: number;
  duration: number;
  manual_subscription: boolean;
  flags: Flag[];
  free: boolean;
}

export interface Team {
  id: number;
  name: string;
  url: string;
  final_mark: number | null;
  project_id: number;
  created_at: string | null;
  updated_at: string | null;
  status: string | null;
  terminating_at: string | null; //?
  users: {
    id: number;
    login: string;
    url: string;
    leader: boolean;
    occurrence: number;
    validated: boolean;
    projects_user_id: number;
  }[];
  locked: boolean | null;
  validate: boolean | null;
  close: boolean | null;
  locked_at: string | null;
  closed_at: string | null;
  project_session_id: number | null;
}

export interface User {
  id: number;
  login: string;
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
export class EvalLog {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  scale_id: number;

  @Prop({ required: true, type: String })
  comment: string;

  @Prop({ required: true, type: String })
  created_at: string;

  @Prop({ required: true, type: String })
  updated_at: string;

  @Prop({ required: false, type: String })
  feedback: string | null;

  @Prop({ required: true })
  final_mark: number;

  @Prop({ type: Object })
  flag: Flag;

  @Prop({ required: true })
  begin_at: string;

  @Prop({ type: [Object] })
  correcteds: User[];

  @Prop({ type: Object })
  corrector: User;

  @Prop({ required: false, type: String })
  filled_at: string | null;

  @Prop({ type: Object })
  scale: Scale;

  @Prop({ type: Object })
  team: Team;

  @Prop({ type: [Object], required: false })
  feedbacks: Feedback[];
}

export const EvalLogSchema = SchemaFactory.createForClass(EvalLog);
