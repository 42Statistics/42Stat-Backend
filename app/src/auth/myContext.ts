import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const MyContext = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req.user.userId;
  },
);
