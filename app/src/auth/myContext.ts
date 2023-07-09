import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type MyContext = {
  userId: number;
  accessToken: string;
};

export const MyUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<MyContext>().userId;
  },
);

export const MyAccessToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<MyContext>().accessToken;
  },
);
