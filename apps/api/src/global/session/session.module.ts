import { Module } from "@nestjs/common";
import { SessionManager } from "./manager/session.manager";
import { RedisModule } from "../redis/redis.module";
import { JwtGlobalModule } from "../jwt/jwt.module";

@Module({
    imports: [RedisModule, JwtGlobalModule],
    providers: [SessionManager],
    exports: [SessionManager],
})
export class SessionModule {}