import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CustomContext = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req.user.userId;
  },
);

//https://github.com/nestjs/graphql/issues/995
