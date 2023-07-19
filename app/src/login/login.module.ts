import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from 'src/api/account/account.module';
import { ConfigRegister } from 'src/config/config.register';
import { ConfigRegisterModule } from 'src/config/config.register.module';
import { TokenSchema, token } from './db/token.database.schema';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    AccountModule,
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
    HttpModule,
    ConfigRegisterModule,
  ],
  providers: [LoginResolver, LoginService, ConfigRegister, ConfigService],
  exports: [LoginService],
})
export class LoginModule {}
