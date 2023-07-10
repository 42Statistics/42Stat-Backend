import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { CacheDecoratorOnReturnRegister } from './cache.decorator.onReturn.register';

@Module({
  imports: [DiscoveryModule, MetadataScanner],
  providers: [CacheDecoratorOnReturnRegister],
})
// eslint-disable-next-line
export class CacheDecoratorOnReturnModule {}
