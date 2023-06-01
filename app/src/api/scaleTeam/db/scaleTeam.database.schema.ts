import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserBase } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { TeamBase } from 'src/api/team/db/team.database.schema';

export type ScaleTeamDocument = HydratedDocument<scale_team>;

// @Schema()
// export class Truant {
// }

@Schema()
export class Languages {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  identifier: string;

  @Prop()
  createdAt: Date;

  @Prop()
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

  @Prop()
  icon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

@Schema()
export class Scale {
  @Prop()
  id: number;

  @Prop()
  evaluationId: number;

  @Prop()
  name: string;

  @Prop()
  isPrimary: boolean;

  @Prop()
  comment: string;

  @Prop()
  introductionMd: string;

  @Prop()
  disclaimerMd: string;

  @Prop()
  guidelinesMd: string;

  @Prop()
  createdAt: Date;

  @Prop()
  correctionNumber: number;

  @Prop()
  duration: number;

  @Prop()
  manualSubscription: boolean;

  @Prop()
  languages: Languages[];

  @Prop()
  flags: Flag[];

  @Prop()
  free: boolean;
}

@Schema()
export class Feedback {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  user: UserBase;

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
  beginAt: Date;

  @Prop()
  comment?: string;

  @Prop({ required: true })
  correcteds: UserBase[];

  @Prop({ required: true })
  corrector: UserBase;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  feedback?: string;

  @Prop()
  feedbacks: Feedback;

  @Prop()
  filledAt?: Date;

  @Prop()
  finalMark?: number;

  @Prop({ required: true })
  flag: Flag;

  // @Prop()
  // questionsWithAnswers:

  @Prop()
  scale: Scale;

  @Prop({ required: true })
  scaleId: number;

  // 평가 취소된 사람 (지각한 사람) 를 의미함
  // @Prop()
  // truant: Truant;

  @Prop({ required: true })
  updatedAt: Date;
}

@Schema()
export class scale_team extends ScaleTeamBase {
  @Prop({ required: true })
  team: TeamBase;
}

export const ScaleTeamSchema = SchemaFactory.createForClass(scale_team);
