import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginSchema, login } from './db/login.database.schema';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';
import { TokenSchema, token } from './db/token.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: login.name, schema: LoginSchema }]),
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
    HttpModule,
  ],
  providers: [LoginResolver, LoginService],
})
export class LoginModule {}
