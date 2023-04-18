import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum CoaliltionName {
  GUN = 85,
  GON = 86,
  GAM = 87,
  LEE = 88,
}

registerEnumType(CoaliltionName, {
  name: 'CoaliltionName',
});

@ObjectType()
export class Coalition {
  @Field((_type) => ID)
  id: number;

  @Field((_type) => CoaliltionName)
  name: CoaliltionName;
}
