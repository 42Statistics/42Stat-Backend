import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { login } from './db/login.database.schema';
import type { GoogleLoginInput } from './login.dto';
import type { Tokens } from './models/login.models';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(login.name)
    private loginModel: Model<login>,
    private readonly httpService: HttpService,
  ) {}

  async login({
    code,
    google,
  }: { google: GoogleLoginInput | undefined } & {
    code: string | undefined;
  }): Promise<Tokens> {
    if (!code) {
      console.log('연동된 42 계정이 없음');
      throw new Error();
    }

    const userInfo = await this.loginWith42(code);

    if (!google) {
      console.log('42 login');
      const user = await this.loginModel.findOne({ ftUid: userInfo.ftUid });
      if (!user) {
        const newUser = new this.loginModel({ ftUid: userInfo.ftUid });
        await newUser.save();
      }

      return userInfo;
    }

    console.log('google, 42 login');

    const googleId = await this.getGoogleId(google);

    const user = await this.loginModel.findOneAndUpdate(
      { googleId },
      { ftUid: userInfo.ftUid, googleId },
    );

    if (!user) {
      const newUser = new this.loginModel({ ftUid: userInfo.ftUid, googleId });
      await newUser.save();
    }

    return userInfo;
  }

  async loginWith42(code: string): Promise<Tokens> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      console.log('env 설정');
      console.log(apiUid);
      console.log(apiSecret);
      console.log(redirectUri);
      throw new Error();
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', apiUid);
    params.set('client_secret', apiSecret);
    params.set('code', code);
    params.set('redirect_uri', redirectUri);

    const tokens = await lastValueFrom(
      this.httpService.post<Tokens>(intraTokenUrl, params),
    );

    const userInfo = await lastValueFrom(
      this.httpService.get(intraMeUrl, {
        headers: { Authorization: `Bearer ${tokens.data.access_token}` },
      }),
    );

    return {
      ftUid: userInfo.data.id,
      access_token: tokens.data.access_token,
      refresh_token: tokens.data.refresh_token,
    };
  }

  async getGoogleId(input: GoogleLoginInput | undefined): Promise<string> {
    if (!input) {
      throw new NotFoundException();
    }

    const client = new OAuth2Client({
      clientId: input.clientId,
    });

    try {
      const ticket = await client.verifyIdToken({
        idToken: input.credential,
        audience: input.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('payload 가져오기 실패');
      }

      const sub = payload.sub;

      return sub;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
