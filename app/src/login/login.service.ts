import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import { lastValueFrom } from 'rxjs';
import type { token } from 'src/auth/token/db/token.database.schema';
import { TokenService } from 'src/auth/token/token.service';
import { FT_CLIENT_CONFIG } from 'src/config/ftClient';
import { GOOGLE_CLIENT_CONFIG } from 'src/config/googleClient';
import { JWT_CONFIG } from 'src/config/jwt';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { AccountService } from 'src/login/account/account.service';
import type { account } from './account/db/account.database.schema';
import type { GoogleLoginInput } from './dtos/login.dto';
import type {
  Account,
  LinkableAccount,
  LoginResult,
  LoginSuccess,
} from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class LoginService {
  constructor(
    @Inject(JWT_CONFIG.KEY)
    private readonly jwtConfig: ConfigType<typeof JWT_CONFIG>,
    @Inject(FT_CLIENT_CONFIG.KEY)
    private readonly ftClientConfig: ConfigType<typeof FT_CLIENT_CONFIG>,
    @Inject(GOOGLE_CLIENT_CONFIG.KEY)
    private readonly googleClientConfig: ConfigType<
      typeof GOOGLE_CLIENT_CONFIG
    >,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
    private readonly accountService: AccountService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async ftLogin(ftCode: string): Promise<LoginSuccess> {
    const userId = await this.getFtUser(ftCode);

    await this.accountService.createIfNotExist(userId);

    return await this.createToken(userId);
  }

  /**
   *
   * @returns 연동이 필요한 계정: LoginNotLinked
   * @returns 존재하는 유저: LoginSuccess
   */
  async googleLogin(
    google: GoogleLoginInput,
    ftCode?: string,
  ): Promise<typeof LoginResult> {
    const googleUser = await this.getGoogleUser(google);

    if (ftCode) {
      const userId = await this.getFtUser(ftCode);

      await this.accountService.createIfNotExist(userId);

      await this.linkAccount(userId, googleUser);

      const loginUser = await this.createToken(userId);

      return loginUser;
    }

    const linkedUser: Pick<account, 'userId'> | null =
      await this.accountService.findOneAndLean({
        filter: {
          'linkedAccounts.platform': googleUser.platform,
          'linkedAccounts.id': googleUser.id,
        },
        select: { userId: 1 },
      });

    if (!linkedUser) {
      return {
        message: 'NotLinked',
      };
    }

    return await this.createToken(linkedUser.userId);
  }

  /**
   *
   * @throws {BadRequestException} ftCode가 유효하지 않은 경우
   */
  private async getFtUser(ftCode: string): Promise<number> {
    if (this.runtimeConfig.PROD) {
      try {
        return await this.requestFtOAuth({
          clientId: this.ftClientConfig.ID,
          clientSecret: this.ftClientConfig.SECRET,
          redirectURI: this.ftClientConfig.REDIRECT_URI,
          ftCode,
        });
      } catch (e) {
        console.error(e);
        try {
          return await this.requestFtOAuth({
            clientId: this.ftClientConfig.ID,
            clientSecret: this.ftClientConfig.SECRET,
            redirectURI: this.ftClientConfig.REDIRECT_URI,
            ftCode,
          });
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
    } else {
      try {
        return await this.requestFtOAuth({
          clientId: this.ftClientConfig.LOCAL_ID,
          clientSecret: this.ftClientConfig.LOCAL_SECRET,
          redirectURI: this.ftClientConfig.LOCAL_REDIRECT_URI,
          ftCode,
        });
      } catch (e) {
        if (e instanceof BadRequestException) {
          return await this.requestFtOAuth({
            clientId: this.ftClientConfig.DEV_ID,
            clientSecret: this.ftClientConfig.DEV_SECRET,
            redirectURI: this.ftClientConfig.DEV_REDIRECT_URI,
            ftCode,
          });
        }

        throw e;
      }
    }
  }

  /**
   *
   *  @throws {BadRequestException} ftCode가 유효하지 않은 경우
   *  @throws {InternalServerErrorException} 42 server 가 불안정한 경우
   */
  private async requestFtOAuth({
    clientId,
    clientSecret,
    redirectURI,
    ftCode,
  }: {
    clientId: string;
    clientSecret: string;
    redirectURI: string;
    ftCode: string;
  }): Promise<number> {
    const searchParams = new URLSearchParams();

    searchParams.set('grant_type', 'authorization_code');
    searchParams.set('client_id', clientId);
    searchParams.set('client_secret', clientSecret);
    searchParams.set('code', ftCode);
    searchParams.set('redirect_uri', redirectURI);

    let accessToken: string;

    try {
      const authResult = await lastValueFrom(
        this.httpService.post<{ access_token: string }>(
          this.ftClientConfig.INTRA_TOKEN_URL,
          searchParams,
        ),
      );

      accessToken = authResult.data.access_token;
    } catch {
      throw new BadRequestException('42 code error');
    }

    try {
      const userInfo = await lastValueFrom(
        this.httpService.get<{ id: number }>(this.ftClientConfig.INTRA_ME_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      return userInfo.data.id;
    } catch {
      throw new InternalServerErrorException('42 server error');
    }
  }

  async generateTokenPair(userId: number): Promise<Omit<token, 'userId'>> {
    const accessToken = await this.generateToken(
      userId,
      this.jwtConfig.ACCESS_EXPIRES,
    );
    const refreshToken = await this.generateToken(
      userId,
      this.jwtConfig.REFRESH_EXPIRES,
    );

    return { accessToken, refreshToken };
  }

  /**
   *
   * @throws {BadRequestException} 외부 사이트에서 인증된 googleInput인 경우
   */
  async getGoogleUser(input: GoogleLoginInput): Promise<LinkableAccount> {
    const oAuth2Client = new OAuth2Client();

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: input.credential,
      audience: input.clientId,
    });

    // https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/oauth2client.ts#L1277
    // https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/loginticket.ts#L26
    // eslint-disable-next-line
    const { sub, email, aud } = ticket.getPayload()!;

    if (
      !(this.runtimeConfig.PROD && this.isProdGoogleClientId(aud)) &&
      !this.isDevOrLocalGoogleClientId(aud)
    ) {
      throw new BadRequestException();
    }

    return {
      platform: 'google',
      id: sub,
      email: email,
      linkedAt: new Date(),
    };
  }

  private isProdGoogleClientId(clientId: string): boolean {
    return this.googleClientConfig.CLIENT_ID === clientId;
  }

  private isDevOrLocalGoogleClientId(clientId: string): boolean {
    return (
      this.googleClientConfig.DEV_CLIENT_ID === clientId ||
      this.googleClientConfig.LOCAL_CLEINT_ID === clientId
    );
  }

  async createToken(userId: number): Promise<LoginSuccess> {
    const { accessToken, refreshToken } = await this.generateTokenPair(userId);

    const newToken = await this.tokenService.create(
      userId,
      accessToken,
      refreshToken,
    );

    return {
      ...newToken,
      message: 'OK',
    };
  }

  async linkGoogle(userId: number, google: GoogleLoginInput): Promise<Account> {
    const googleUser = await this.getGoogleUser(google);

    return await this.linkAccount(userId, googleUser);
  }

  /**
   *
   * @throws {ConflictException} 연동하려는 소셜 계정이 이미 42계정에서 사용중인 경우
   * @throws {ConflictException} 연동하려는 소셜 플랫폼이 이미 다른 계정으로 연결되어있는 경우
   * @throws {NotFoundException} 없는 유저인 경우
   */
  async linkAccount(
    userId: number,
    account: LinkableAccount,
  ): Promise<Account> {
    const duplicateLinkable = await this.accountService.findOneAndLean({
      filter: {
        'linkedAccounts.platform': account.platform,
        'linkedAccounts.id': account.id,
      },
      select: {},
    });

    if (duplicateLinkable) {
      throw new ConflictException();
    }

    const userAccount = await this.accountService.findOne({
      filter: { userId },
    });

    if (!userAccount) {
      throw new NotFoundException();
    }

    const alreadyLinkedPlatform = userAccount.linkedAccounts.find(
      (linkedAccount) => linkedAccount.platform === account.platform,
    );

    if (alreadyLinkedPlatform) {
      throw new ConflictException();
    }

    userAccount.linkedAccounts.push(account);

    return await userAccount.save().then((result) => result.toObject());
  }

  /**
   *
   * @throws {NotFoundException} 없는 유저인 경우
   */
  async unlinkAccount(
    userId: number,
    targetPlatform: string,
  ): Promise<Account> {
    const user = await this.accountService.findOneAndUpdateAndLean({
      filter: { userId },
      update: {
        $pull: { linkedAccounts: { platform: targetPlatform } },
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async generateToken(userId: number, expiresIn: string): Promise<string> {
    return await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: expiresIn,
        secret: this.jwtConfig.SECRET,
      },
    );
  }

  /**
   *
   * @throws {BadRequestException} 유효하지 않은 refreshToken 인 경우
   */
  async refreshToken(refreshToken: string): Promise<LoginSuccess> {
    let userId: number;

    try {
      userId = await this.verifyToken(refreshToken);
    } catch (e) {
      throw new BadRequestException('유효하지 않은 refreshToken');
    }

    const accessToken = await this.generateToken(
      userId,
      this.jwtConfig.ACCESS_EXPIRES,
    );

    const newTokens = await this.tokenService.findOneAndUpdateAndLean({
      filter: { refreshToken },
      update: { userId, accessToken, refreshToken },
    });

    if (!newTokens) {
      throw new BadRequestException();
    }

    return {
      ...newTokens,
      message: 'OK',
    };
  }

  async logout(accessToken: string): Promise<number> {
    return await this.tokenService.deleteOne({
      accessToken,
    });
  }

  async deleteAccount(userId: number): Promise<number> {
    await this.tokenService.deleteMany({ userId });

    return await this.accountService.deleteOne({ userId });
  }

  async verifyToken(targetToken: string): Promise<number> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(targetToken);

      return verifiedToken.userId;
    } catch (e) {
      throw new UnauthorizedException('Token expired');
    }
  }

  /**
   * @description 매일 05:00에 로그인 후 1주일이 지난 토큰을 삭제
   */
  @Cron('0 5 * * *')
  async deleteTokens() {
    const beforeOneWeek = new DateWrapper().moveWeek(-1).toDate();

    await this.tokenService.deleteMany({
      _id: {
        $lt: mongoose.Types.ObjectId.createFromTime(
          Math.floor(beforeOneWeek.getTime() / DateWrapper.SEC),
        ),
      },
    });
  }
}
