import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './login.resolver';
import { AuthService } from './login.service';
import { LoginSchema, login } from './db/login.database.schema';
import { TokenSchema, token } from './db/token.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: login.name, schema: LoginSchema }]),
    HttpModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class LoginModule {}
