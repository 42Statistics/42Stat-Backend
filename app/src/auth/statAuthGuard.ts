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
  constructor(private jwtService: JwtService) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const context = gqlExecutionContext.getContext();

    const accessToken = context.req.header('Authorization');

    const { userId, token } = await this.verifyToken(accessToken);

    context.userId = userId;
    context.accessToken = token;

    return true;
  }

  async verifyToken(
    accessToken: string | undefined,
  ): Promise<{ userId: number; token: string }> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    try {
      const { userId } = await this.jwtService.verifyAsync<{
        userId: number;
      }>(token);

      return { userId, token };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
