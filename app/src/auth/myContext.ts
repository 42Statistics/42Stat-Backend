import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type MyContext = {
  userId: number;
};

export const MyUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<MyContext>().userId;
  },
);
