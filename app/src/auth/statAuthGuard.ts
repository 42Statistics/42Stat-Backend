import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StatAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context = gqlExecutionContext.getContext();

    const authString = context.req.header('Authorization');

    const verifyContext = await this.verifyToken(authString);
    Object.assign(context, verifyContext);

    return true;
  }

  async verifyToken(
    authString: string | undefined,
  ): Promise<{ userId: number; accessToken: string }> {
    if (!authString || !authString.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const accessToken = authString.split(' ')[1];

    try {
      const { userId } = await this.jwtService.verifyAsync<{
        userId: number;
      }>(accessToken);

      return { userId, accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
