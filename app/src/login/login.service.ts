import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import type { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { StatDate } from 'src/statDate/StatDate';
import { LoginDocument, login } from './db/login.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput } from './dtos/login.dto';
import { GoogleUser, StatusUnion } from './models/login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(login.name) private loginModel: Model<login>,
    @InjectModel(token.name) private tokenModel: Model<token>,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  //todo: loginModel임을 적어야함...
  async findOne(filter?: FilterQuery<login>): Promise<LoginDocument> {
    const login = await this.loginModel.findOne(filter);

    if (!login) {
      throw new NotFoundException();
    }

    return login;
  }

  async login({
    code,
    google,
  }: { google: GoogleLoginInput | undefined } & {
    code: string | undefined;
  }): Promise<typeof StatusUnion> {
    if (code && google) {
      const user = await this.loginWith42(code);
      const googleUser = await this.getGoogleUser(google);

      if (user.status !== 200) {
        return user;
      }

      await this.upsertLogin(user.userId, googleUser);

      const accessToken = await this.generateAcccessToken(user.userId);
      const refreshToken = await this.generateRefreshToken(user.userId);

      return await this.upsertToken(user.userId, accessToken, refreshToken);
    }

    if (code) {
      const user = await this.loginWith42(code);
      if (user.status !== 200) {
        return user;
      }
      //todo: check google user delete
      await this.upsertLogin(user.userId);

      const accessToken = await this.generateAcccessToken(user.userId);
      const refreshToken = await this.generateRefreshToken(user.userId);

      return await this.upsertToken(user.userId, accessToken, refreshToken);
    }

    if (google) {
      return await this.loginWithGoogle(google);
    }

    //error
    return {
      status: 404,
      message: 'Nothing input',
    };
  }

  async loginWith42(code: string): Promise<typeof StatusUnion> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      return {
        status: 500,
        message: 'Missing environment configuration',
      };
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
        status: 200,
      };
    } catch (e) {
      return {
        status: 401,
        message: 'Token error',
      };
    }
  }

  async loginWithGoogle(
    googleInput: GoogleLoginInput,
  ): Promise<typeof StatusUnion> {
    const googleUser = await this.getGoogleUser(googleInput);
    const user = await this.loginModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!user) {
      return {
        status: 401,
        message: 'No associated 42 account found',
      };
    }

    const token = await this.tokenModel.findOne({ userId: user.userId });

    if (token) {
      return {
        status: 200,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: token.userId,
      };
    }

    const accessToken = await this.generateAcccessToken(user.userId);
    const refreshToken = await this.generateRefreshToken(user.userId);

    return {
      status: 200,
      accessToken,
      refreshToken,
      userId: user.userId,
    };
  }

  async getGoogleUser(input: GoogleLoginInput): Promise<GoogleUser> {
    const client = new OAuth2Client({
      clientId: input.clientId,
    });

    const ticket = await client.verifyIdToken({
      idToken: input.credential,
      audience: input.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new InternalServerErrorException();
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      time: new StatDate(),
    };
  }

  async upsertLogin(userId: number, googleUser?: GoogleUser): Promise<boolean> {
    const updateData = googleUser
      ? {
          userId,
          googleId: googleUser.googleId,
          googleEmail: googleUser.email,
          linkedTime: googleUser.time,
        }
      : { userId };
    //todo: null로 들어가도 되는지 확인
    await this.loginModel.findOneAndUpdate({ userId }, updateData);

    return true;
  }

  async upsertToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<typeof StatusUnion> {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true },
    );

    return {
      status: 200,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
      userId: newToken.userId,
    };
  }

  async linkGoogle(userId: number, google: GoogleLoginInput): Promise<boolean> {
    const googleUser = await this.getGoogleUser(google);
    const user = await this.loginModel.findOneAndUpdate(
      { userId },
      {
        userId,
        googleId: googleUser.googleId,
        email: googleUser.email,
        time: new StatDate(),
      },
      { upsert: true, new: true },
    );

    if (!user || !googleUser) {
      return false;
    }

    return true;
  }

  async unlinkGoogle(userId: number): Promise<boolean> {
    const user = await this.loginModel.findOneAndUpdate(
      { userId },
      { $unset: { googleId: 1, email: 1, time: 1 } },
    );

    if (!user) {
      return false;
    }

    return true;
  }

  /**-----token-----**/

  async generateAcccessToken(userId: number): Promise<string> {
    const user = await this.findOne({ userId });
    const payload = { userId: user.userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
      secret: process.env.JWT_SECRET,
    });

    return accessToken;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const user = await this.findOne({ userId });
    const payload = { userId: user.userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15d',
      secret: process.env.JWT_SECRET,
    });

    return refreshToken;
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<typeof StatusUnion> {
    const { exp: e, userId: u } = this.jwtService.verify(accessToken);

    //todo: 반환할것
    //todo: verify도 exp검사 하는지 확인
    if (StatDate.now() < e * 1000) {
      return { status: 200, accessToken, refreshToken, userId: u };
    }

    const { userId, iat, exp } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(refreshToken);

    //exp유효성은 verifyAsync 내부에서 처리됨 ...

    if (StatDate.now() > exp * 1000) {
      return {
        status: 401,
        message: '유효하지 않은 refreshToken',
      };
    }

    const newAccessToken = await this.generateAcccessToken(userId);

    await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, newAccessToken, refreshToken },
      { upsert: true, new: true },
    );

    return {
      status: 200,
      accessToken: newAccessToken,
      refreshToken,
      userId,
    };
  }

  async logout(userId: number): Promise<boolean> {
    //모두 삭제...?
    await this.tokenModel.deleteMany({ userId });
    return true;
  }

  async deleteAccount(userId: number): Promise<boolean> {
    await this.loginModel.deleteOne({ userId });
    return true;
  }
}
