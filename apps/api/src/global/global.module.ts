import { Global, Module } from "@nestjs/common";
import { ExceptionModule } from "./error/exception.module";
import { PrismaConnectorModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { GuardsModule } from "./guards/guards.module";
import { InterceptorsModule } from "./interceptors/interceptors.module";

@Global()
@Module({
    imports: [
        RedisModule,
        GuardsModule,
        InterceptorsModule,
        ExceptionModule,
        PrismaConnectorModule,
    ],
    exports: [
        PrismaConnectorModule
    ]
})
export class GlobalModule {}