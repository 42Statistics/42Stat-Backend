import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { login_user } from './auth.database.schema';
import { LoginUser } from './auth.models';
import { GoogleLoginInput } from './google.login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(login_user.name)
    private loginUserModel: Model<login_user>,
  ) {}

  async loginWithGoogle(input: GoogleLoginInput): Promise<LoginUser> {
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

      const user = new this.loginUserModel({
        sub,
      });
      //42id와 매치 후 저장
      await user.save();

      return { sub };
    } catch (error) {
      console.log(error);
      throw new Error('구글 로그인 실패');
    }
  }
}
