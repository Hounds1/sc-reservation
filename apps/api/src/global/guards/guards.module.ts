import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RequestHook } from './request/request.hook';
import { DuplicateRequestGuard } from './request/request.guard';
import { RateLimitGuard } from './request/rate.limit.guard';

@Global()
@Module({
  providers: [
    RequestHook,
    {
      provide: APP_GUARD,
      useClass: DuplicateRequestGuard,
    },
    {
      provide: APP_GUARD,
      useFactory: () => new RateLimitGuard(100, 60000),
    },
  ],
  exports: [RequestHook],
})
export class GuardsModule {}