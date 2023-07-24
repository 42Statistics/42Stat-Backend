import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/auth/token/token.module';
import { AccountModule } from 'src/login/account/account.module';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    AccountModule,
    TokenModule,
    HttpModule,
  ],
  providers: [LoginResolver, LoginService],
  exports: [LoginService],
})
// eslint-disable-next-line
export class LoginModule {}
