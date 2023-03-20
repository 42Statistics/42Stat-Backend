import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

// Key generics?
@InputType()
export abstract class SortOrderInput {
  @Field((_type) => SortOrder)
  order: SortOrder;
}
