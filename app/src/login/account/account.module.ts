import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountSchema,
  account,
} from 'src/login/account/db/account.database.schema';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: account.name, schema: AccountSchema }]),
  ],
  providers: [AccountService],
  exports: [MongooseModule, AccountService],
})
// eslint-disable-next-line
export class AccountModule {}
