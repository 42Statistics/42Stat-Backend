import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { project } from 'src/api/project/db/project.database.schema';

export type ProjectSessionDocument = HydratedDocument<project_session>;

@Schema()
export class ProjectSessionEvaluation {
  id: number;
  kind: string;
}

@Schema()
export class ProjectSessionRuleParam {
  id: number;
  paramId: number;
  projectSessionsRuleId: number;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema()
export class ProjectSessionRule {
  id: number;
  required: boolean;
  position: number;
  params: ProjectSessionRuleParam[];
  rule: {
    id: number;
    kind: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    internalName: string;
  };
}

@Schema()
export class ProjectSessionScale {
  id: number;
  correctionNumber?: number;
  isPrimary: boolean;
}

@Schema()
export class ProjectSessionUpload {
  id: number;
  name: string;
}

@Schema()
export class project_session {
  @Prop({ required: true })
  id: number;

  @Prop()
  solo?: boolean;

  @Prop()
  beginAt?: Date;

  @Prop()
  endAt?: Date;

  @Prop({ required: true })
  estimateTime?: string;

  @Prop({ required: true })
  difficulty?: number;

  @Prop()
  objectives?: string[];

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true })
  durationDays?: number;

  @Prop()
  terminatingAfter?: number;

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  campusId?: number;

  @Prop({ required: true })
  cursusId?: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  maxPeople?: number;

  @Prop()
  isSubscriptable?: boolean;

  @Prop()
  scales: ProjectSessionScale[];

  @Prop()
  uploads: ProjectSessionUpload[];

  @Prop()
  teamBehaviour: string;

  @Prop()
  commit?: string;

  @Prop({ required: true })
  project: project;

  // campus?: campus;
  // cursus?: cursus;

  @Prop()
  evaluations: ProjectSessionEvaluation[];

  @Prop()
  projectSessionsRules: ProjectSessionRule;
}

export const ProjectSessionSchema =
  SchemaFactory.createForClass(project_session);
