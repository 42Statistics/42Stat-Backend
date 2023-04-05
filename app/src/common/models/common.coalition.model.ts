import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum CoaliltionName {
  GUN,
  GON,
  GAM,
  LEE,
}

registerEnumType(CoaliltionName, {
  name: 'CoaliltionName',
});

@ObjectType()
export class Coalition {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => CoaliltionName)
  name: CoaliltionName;
}
