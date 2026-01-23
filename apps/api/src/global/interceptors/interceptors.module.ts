import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TimeoutInterceptor } from "./timeout/timeout.interceptor";
import { WrapResponseInterceptor } from "./response/response.interceptor";


@Global()
@Module({
  providers: [
    {
        provide: APP_INTERCEPTOR,
        useFactory: () => new TimeoutInterceptor(30000),
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: WrapResponseInterceptor,
    },
  ],
})
export class InterceptorsModule {}