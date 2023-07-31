import { registerEnumType } from '@nestjs/graphql';

export enum TeamStatus {
  REGISTERED,
  IN_PROGRESS,
  WAITING_FOR_CORRECTION,
  FINISHED,
}

registerEnumType(TeamStatus, { name: 'TeamStatus' });
