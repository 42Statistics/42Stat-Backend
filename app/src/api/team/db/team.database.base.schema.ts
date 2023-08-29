import { Prop, Schema } from '@nestjs/mongoose';
import { UserBase } from 'src/api/user/db/user.database.schema';

// todo: cursus user 완성 후 고치기
@Schema()
export class TeamUser extends UserBase {
  @Prop({ required: true })
  leader: boolean;

  @Prop({ required: true })
  occurrence: number;

  @Prop({ required: true })
  validated: boolean;

  @Prop({ required: true })
  projectsUserId: number;
}

@Schema()
export class TeamBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  'closed?': boolean;

  @Prop({ required: true })
  closedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  finalMark?: number;

  @Prop({ required: true })
  'locked?': boolean;

  @Prop()
  lockedAt?: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  projectSessionId: number;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  users: TeamUser[];

  @Prop({ required: true, type: String })
  status:
    | 'creating_group'
    | 'finished'
    | 'in_progress'
    | 'waiting_for_correction';

  @Prop()
  terminatingAt?: Date;

  @Prop()
  'validated?'?: boolean;
}
