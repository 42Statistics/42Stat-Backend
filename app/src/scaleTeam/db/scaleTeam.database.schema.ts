import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TeamBase } from 'src/team/db/team.database.schema';

export type ScaleTeamDocument = HydratedDocument<scale_team>;

@Schema()
export class Languages {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

@Schema()
export class Flag {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  positive: boolean;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

@Schema()
export class Scale {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  evaluationId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isPrimary: boolean;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  introductionMd: string;

  @Prop({ required: true })
  disclaimerMd: string;

  @Prop({ required: true })
  guidelinesMd: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  correctionNumber: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  manualSubscription: boolean;

  @Prop({ required: true })
  languages: Languages[];

  @Prop({ required: true })
  flags: Flag[];

  @Prop({ required: true })
  free: boolean;
}

// todo: cursus user 완성 후 고치기
@Schema()
export class User {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  url: string;
}

@Schema()
export class Feedback {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  user: User;

  @Prop({ required: true })
  feedbackableType: string;

  @Prop({ required: true })
  feedbackableId: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  createdAt: Date;
}

@Schema()
export class ScaleTeamBase {
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

  @Prop({ required: true })
  flag: Flag;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  correcteds: User[];

  @Prop({ required: true })
  corrector: User;

  // 평가 취소된 사람 (지각한 사람) 를 의미함
  // @Prop({ required: false, type: Object })
  // truant: object;

  @Prop()
  filledAt?: Date;

  @Prop({ required: true })
  scale: Scale;
}

@Schema()
export class scale_team extends ScaleTeamBase {
  @Prop({ required: true })
  team: TeamBase;
}

export const ScaleTeamSchema = SchemaFactory.createForClass(scale_team);
