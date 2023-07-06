import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { StatDate } from 'src/statDate/StatDate';
import { LoginDocument, login } from './db/login.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput } from './dtos/login.dto';
import { GoogleUser, StatusType } from './models/login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(login.name) private loginModel: Model<login>,
    @InjectModel(token.name) private tokenModel: Model<token>,
    private readonly httpService: HttpService,
  ) {}

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
  }): Promise<(typeof StatusType)[]> {
    if (code && google) {
      const user = await this.loginWith42(code);
      const googleUser = await this.getGoogleUser(google);
      await this.upsertLogin(user.userId, googleUser.googleId);

      return await this.upsertToken(
        user.userId,
        user.accessToken,
        user.refreshToken,
      );
    }

    if (code) {
      const user = await this.loginWith42(code);

      await this.upsertLogin(user.userId);

      return await this.upsertToken(
        user.userId,
        user.accessToken,
        user.refreshToken,
      );
    }

    if (google) {
      return await this.loginWithGoogle(google);
    }

    //error
    return [
      {
        status: 404,
        message: 'Nothing input',
      },
    ];
  }

  async loginWith42(
    code: string,
  ): Promise<{ userId: number; accessToken: string; refreshToken: string }> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      console.log('env 설정');
      throw new Error();
      //todo
      // return [
      //   {
      //     status: 500,
      //     message: 'Missing environment configuration',
      //   },
      // ];
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

      console.log(tokens.data); //type <>

      const userInfo = await lastValueFrom(
        //<user>
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
      throw new Error();
      //todo
      // return [
      //   {
      //     status: 401,
      //     message: 'token error',
      //   },
      // ];
    }
  }

  async loginWithGoogle(
    googleInput: GoogleLoginInput,
  ): Promise<(typeof StatusType)[]> {
    const googleUser = await this.getGoogleUser(googleInput);
    const user = await this.loginModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!user) {
      return [
        {
          status: 401,
          message: 'No associated 42 account found',
        },
      ];
    }

    const token = await this.tokenModel.findOne({ userId: user.userId });

    if (!token) {
      return [
        {
          status: 404,
          message: 'Token not found',
        },
      ];
    }

    return [
      {
        status: 200,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: token.userId,
      },
    ];
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

  async upsertLogin(
    userId: number,
    googleId?: string,
  ): Promise<(typeof StatusType)[]> {
    const updateData = googleId ? { userId, googleId } : { userId };
    //todo: null로 들어가도 되는지 확인
    await this.loginModel.findOneAndUpdate({ userId }, updateData, {
      upsert: true,
    });

    return [
      {
        status: 200,
        message: '유저 저장 혹은 업데이트',
      },
    ];
  }

  async upsertToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<(typeof StatusType)[]> {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true },
    );

    return [
      {
        status: 200,
        accessToken: newToken.accessToken,
        refreshToken: newToken.refreshToken,
        userId: newToken.userId,
      },
    ];
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

  // async checkExpiresAccessToken(
  //   accessToken: string,
  // ): Promise<(typeof StatusType)[]> {

  //   if (tokenInfo.data.expires_in_seconds <= 0) {
  //     return [
  //       {
  //         status: 403,
  //         message: 'Expired access token',
  //       },
  //     ];
  //   }

  //   return [
  //     {
  //       status: 200,
  //       message: 'succeed',
  //     },
  //   ];
  // }
}
