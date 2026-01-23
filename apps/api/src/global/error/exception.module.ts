import { Global, Module } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
import { APP_FILTER } from "@nestjs/core";

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionModule {}