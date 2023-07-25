import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { MyAccessToken, MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GoogleLoginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { Account, LoginResult, LoginSuccess } from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => LoginSuccess)
  async ftLogin(@Args('ftCode') ftCode: string): Promise<LoginSuccess> {
    return await this.loginService.ftLogin(ftCode);
  }

  @Mutation((_returns) => LoginResult)
  async googleLogin(
    @Args('google') google: GoogleLoginInput,
    @Args('ftCode', { nullable: true }) ftCode: string,
  ): Promise<typeof LoginResult> {
    return await this.loginService.googleLogin(google, ftCode);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Account)
  async linkGoogle(
    @MyUserId() userId: number,
    @Args('google') google: GoogleLoginInput,
  ): Promise<Account> {
    const googleUser = await this.loginService.getGoogleUser(google);
    return await this.loginService.linkAccount(userId, googleUser);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Account)
  async unlinkAccount(
    @MyUserId() userId: number,
    @Args('targetPlatform') targetPlatform: string,
  ): Promise<Account> {
    return await this.loginService.unlinkAccount(userId, targetPlatform);
  }

  @Mutation((_returns) => LoginSuccess)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<LoginSuccess> {
    return await this.loginService.refreshToken(refreshToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Int)
  async logout(@MyAccessToken() accessToken: string): Promise<number> {
    return await this.loginService.logout(accessToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Int)
  async deleteAccount(@MyUserId() userId: number): Promise<number> {
    return await this.loginService.deleteAccount(userId);
  }
}
