import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { MyContext } from './myContext';

@Injectable()
export class StatAuthGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext): boolean {
    const isAuthenticated = true;

    if (isAuthenticated) {
      const gqlExecutionContext = GqlExecutionContext.create(executionContext);
      const context = gqlExecutionContext.getContext<MyContext>();

      context.userId = 81730;

      return true;
    }

    return false;
  }
}
