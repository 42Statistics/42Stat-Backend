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

    const { userId, iat, exp } = await this.verifyToken(accessToken);

    context.userId = userId;
    context.accessToken = accessToken;

    return true;
  }

  async verifyToken(accessToken: string | undefined): Promise<{
    userId: number;
    iat: number;
    exp: number;
  }> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    //todo: db 존재여부 검사 -> 401

    try {
      const { userId, iat, exp } = await this.jwtService.verifyAsync<{
        userId: number;
        iat: number;
        exp: number;
      }>(token);

      return { userId, iat, exp };
    } catch (e) {
      throw new UnauthorizedException('Access token expired');
    }
  }
}
