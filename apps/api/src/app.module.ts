import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './global/redis/redis.module';
import { ExtensionMiddleware } from '@global/extensions';
import { RequestHook } from './global/guards/request/request.hook';
import { DuplicateRequestGuard } from './global/guards/request/request.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WrapResponseInterceptor } from './global/interceptors/response/response.interceptor';
import { HttpExceptionFilter } from './global/error/exception.filter';
import { RateLimitGuard } from './global/guards/request/rate.limit.guard';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService, 
    RequestHook,
    {
      provide: APP_GUARD,
      useClass: DuplicateRequestGuard,
    },
    {
      provide: APP_GUARD,
      useFactory: () => new RateLimitGuard(100, 60000),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtensionMiddleware).forRoutes('*');
  }
}
