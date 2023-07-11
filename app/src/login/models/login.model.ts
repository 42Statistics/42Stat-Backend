import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class GoogleUser {
  @Field()
  googleId: string;

  @Field()
  googleEmail?: string;

  @Field()
  linkedAt: Date;
}

@ObjectType()
export class NoAssociated {
  @Field()
  message: 'NoAssociated';
}

@ObjectType()
export class Success {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userId: number;

  @Field()
  message: 'OK';
}

export const StatusUnion = createUnionType({
  name: 'StatusUnion',
  types: () => [Success, NoAssociated] as const,
  resolveType(value) {
    switch (value.message) {
      case 'OK':
        return Success;
      case 'NoAssociated':
        return NoAssociated;
    }
  },
});
