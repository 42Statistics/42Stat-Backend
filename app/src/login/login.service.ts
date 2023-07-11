import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import type { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { StatDate } from 'src/statDate/StatDate';
import { AccountDocument, account } from './db/account.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput, loginInput } from './dtos/login.dto';
import type { GoogleUser, Token } from './models/login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(account.name) private accountModel: Model<account>,
    @InjectModel(token.name) private tokenModel: Model<token>,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async findOneAccount(
    filter?: FilterQuery<account>,
  ): Promise<AccountDocument> {
    const account = await this.accountModel.findOne(filter);

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  async login({ code, google }: loginInput): Promise<Token> {
    if (code && google) {
      const login42 = await this.loginWith42(code);
      const googleUser = await this.getGoogleUser(google);

      await this.upsertLogin(login42.userId, googleUser);

      const accessToken = await this.generateAcccessToken(login42.userId);
      const refreshToken = await this.generateRefreshToken(login42.userId);

      return await this.upsertToken(login42.userId, accessToken, refreshToken);
    }

    if (code) {
      const login42 = await this.loginWith42(code);

      //todo: check google userPreview delete
      await this.upsertLogin(login42.userId);

      const accessToken = await this.generateAcccessToken(login42.userId);
      const refreshToken = await this.generateRefreshToken(login42.userId);

      return await this.upsertToken(login42.userId, accessToken, refreshToken);
    }

    if (google) {
      return await this.loginWithGoogle(google);
    }

    throw new NotFoundException('Nothing input');
  }

  async loginWith42(code: string): Promise<Token> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      throw new InternalServerErrorException(
        'Missing environment configuration',
      );
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', apiUid);
    params.set('client_secret', apiSecret);
    params.set('code', code);
    params.set('redirect_uri', redirectUri);

    try {
      const tokens = await lastValueFrom(
        this.httpService.post<{
          access_token: string;
          expires_in: number;
          refresh_token: string;
        }>(intraTokenUrl, params),
      );

      const userInfo = await lastValueFrom(
        this.httpService.get<{ id: number }>(intraMeUrl, {
          headers: { Authorization: `Bearer ${tokens.data.access_token}` },
        }),
      );

      return {
        userId: userInfo.data.id,
        accessToken: tokens.data.access_token,
        refreshToken: tokens.data.refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('Token error');
    }
  }

  async loginWithGoogle(googleInput: GoogleLoginInput): Promise<Token> {
    const googleUser = await this.getGoogleUser(googleInput);
    const user = await this.accountModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!user) {
      throw new UnauthorizedException('No associated 42 account found');
    }

    const token = await this.tokenModel.findOne({ userId: user.userId });

    if (!token) {
      const accessToken = await this.generateAcccessToken(user.userId);
      const refreshToken = await this.generateRefreshToken(user.userId);

      await this.upsertToken(user.userId, accessToken, refreshToken);

      return {
        userId: user.userId,
        accessToken,
        refreshToken,
      };
    }

    return {
      userId: token.userId,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async getGoogleUser(input: GoogleLoginInput): Promise<GoogleUser> {
    try {
      const client = new OAuth2Client({
        clientId: input.clientId,
      });

      const ticket = await client.verifyIdToken({
        idToken: input.credential,
        audience: input.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException();
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        time: new StatDate(),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async upsertLogin(userId: number, googleUser?: GoogleUser): Promise<boolean> {
    const updateData = googleUser
      ? {
          userId,
          googleId: googleUser.googleId,
          googleEmail: googleUser.email,
          linkedAt: googleUser.time,
        }
      : { userId };
    //todo: null로 들어가도 되는지 확인
    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      updateData,
    );
    if (!user) {
      await this.accountModel.create({
        ...updateData,
        createdAt: new StatDate().toString(), //todo
      });
    }

    return true;
  }

  async upsertToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<Token> {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true }, //todo not upsert
    );

    return {
      userId: newToken.userId,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
    };
  }

  async linkGoogle(
    accessToken: string,
    google: GoogleLoginInput,
  ): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    const googleUser = await this.getGoogleUser(google);
    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      {
        userId,
        googleId: googleUser.googleId,
        googleEmail: googleUser.email,
        linkedTime: new StatDate(),
      },
      { upsert: true, new: true },
    );

    if (!user || !googleUser) {
      return false;
    }

    return true;
  }

  async unlinkGoogle(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      { $unset: { googleId: 1, googleEmail: 1, linkedAt: 1 } },
    );

    if (!user) {
      return false;
    }

    return true;
  }

  /**-----token-----**/

  async generateAcccessToken(userId: number): Promise<string> {
    const user = await this.findOneAccount({ userId });
    const payload = { userId: user.userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: process.env.JWT_SECRET,
    });

    return accessToken;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const user = await this.findOneAccount({ userId });
    const payload = { userId: user.userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: process.env.JWT_SECRET,
    });

    return refreshToken;
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<Token> {
    //todo: 401 throw 중
    const { exp: e, userId: u } = await this.jwtService.verifyAsync(
      accessToken,
    );

    if (StatDate.now() < e * 1000) {
      return {
        accessToken,
        refreshToken,
        userId: u,
      };
    }

    try {
      const { userId, iat, exp } = await this.jwtService.verifyAsync<{
        userId: number;
        iat: number;
        exp: number;
      }>(refreshToken);

      const newAccessToken = await this.generateAcccessToken(userId);

      await this.tokenModel.findOneAndUpdate(
        { userId },
        { userId, newAccessToken, refreshToken },
        { upsert: true, new: true },
      );

      return {
        userId,
        accessToken: newAccessToken,
        refreshToken,
      };
    } catch (e) {
      throw new ForbiddenException('유효하지 않은 refreshToken');
    }
  }

  async logout(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const tmp = await this.tokenModel.deleteOne({ accessToken: token });
    if (!tmp) {
      return false;
    }
    return true;
  }

  async deleteAccount(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    await this.tokenModel.deleteMany({ userId });

    const tmp = await this.accountModel.deleteOne({ userId });
    if (!tmp) {
      return false;
    }
    return true;
  }
}
