import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigRegister } from 'src/config/config.register';
import { ConfigRegisterModule } from 'src/config/config.register.module';
import { AccountSchema, account } from './db/account.database.schema';
import { TokenSchema, token } from './db/token.database.schema';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([{ name: account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
    HttpModule,
    ConfigRegisterModule,
  ],
  providers: [LoginResolver, LoginService, ConfigRegister, ConfigService],
  exports: [LoginService],
})
export class LoginModule {}
