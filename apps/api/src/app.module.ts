import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './global/redis/redis.module';
import { ExtensionMiddleware } from '@global/extensions';
import { GuardsModule } from './global/guards/guards.module';
import { InterceptorsModule } from './global/interceptors/interceptors.module';
import { ExceptionModule } from './global/error/exception.module';
import { PrismaConnectorModule } from './global/prisma/prisma.module';

@Module({
  imports: [RedisModule, GuardsModule, InterceptorsModule, ExceptionModule, PrismaConnectorModule],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtensionMiddleware).forRoutes('*');
  }
}
