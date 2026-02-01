import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./service/auth.service";
import { AccountModule } from "../account/account.module";
import { AuthController } from "./controller/auth.controller";
import { SessionModule } from "src/global/session/session.module";
import { JwtGlobalModule } from "src/global/jwt/jwt.module";

@Module({
    imports: [
        AccountModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<number>('JWT_EXPIRES_IN', 900) ?? 900,
                },
            }),
        }),
        SessionModule,
        JwtGlobalModule
      ],
    providers: [
      AuthService,
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}