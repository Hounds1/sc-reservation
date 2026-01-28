import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./service/auth.service";
import { AccountModule } from "../account/account.module";
import { AuthController } from "./controller/auth.controller";

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
      ],
    providers: [
      AuthService,
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}