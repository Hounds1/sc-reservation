import { Global, Module } from "@nestjs/common";
import { ExceptionModule } from "./error/exception.module";
import { PrismaConnectorModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { GuardsModule } from "./guards/guards.module";
import { InterceptorsModule } from "./interceptors/interceptors.module";
import { JwtGlobalModule } from "./jwt/jwt.module";
import { AccessEnsureModule } from "./jwt/ensure.module";
import { SessionModule } from "./session/session.module";

@Global()
@Module({
    imports: [
        RedisModule,
        GuardsModule,
        InterceptorsModule,
        ExceptionModule,
        PrismaConnectorModule,
        JwtGlobalModule,
        AccessEnsureModule,
        SessionModule
    ],
    exports: [
        PrismaConnectorModule
    ]
})
export class GlobalModule {}