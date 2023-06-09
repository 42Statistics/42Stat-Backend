import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
//export class CustomAuthGuard extends AuthGuard('jwt') {
export class CustomAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const isAuthenticated = true;

    if (isAuthenticated) {
      const gqlContext = GqlExecutionContext.create(context);
      const req = gqlContext.getContext().req;

      req.user = { userId: 81730 };

      return true;
    }

    return false;
  }
}
