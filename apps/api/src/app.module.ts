import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ExtensionMiddleware } from '@global/extensions';
import { ConfigModule } from '@nestjs/config';
import { PaginationMiddleware } from './global/pagination/pagination.middleware';
import { GlobalModule } from './global/global.module';
import { CoreModule } from './core/core.module';
import { AccessEnsureMiddleware } from './global/jwt/middleware/access.ensure.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })
    , GlobalModule
    , CoreModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 가드보다 먼저 실행
    consumer.apply(AccessEnsureMiddleware).forRoutes({path: '*path', method: RequestMethod.ALL});
    consumer.apply(ExtensionMiddleware).forRoutes({path: '*path', method: RequestMethod.ALL});
    consumer.apply(PaginationMiddleware).forRoutes({path: '*path', method: RequestMethod.ALL});
  }
}
