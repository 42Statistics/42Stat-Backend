import { Module } from '@nestjs/common';
import { RemoteConfigService } from './remoteConfig.service';

@Module({
  providers: [RemoteConfigService],
  exports: [RemoteConfigService],
})
// eslint-disable-next-line
export class RemoteConfigModule {}
