import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ExtensionMiddleware } from '@global/extensions';
import { ConfigModule } from '@nestjs/config';
import { PaginationMiddleware } from './global/pagination/pagination.middleware';
import { GlobalModule } from './global/global.module';
import { CoreModule } from './core/core.module';

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
    consumer.apply(ExtensionMiddleware).forRoutes({path: '*path', method: RequestMethod.ALL});
    consumer.apply(PaginationMiddleware).forRoutes({path: '*path', method: RequestMethod.ALL});
  }
}
