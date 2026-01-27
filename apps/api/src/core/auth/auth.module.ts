import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { AccountModule } from "../account/account.module";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./controller/auth.controller";
import { JwtStrategy } from "./providers/strategies/jwt.strategy";
import { JwtGuard } from "./providers/guards/jwt.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        AccountModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService): JwtModuleOptions => ({
            secret: config.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: config.get<number>('JWT_EXPIRES_IN', 900) ?? 900,
            },
          }),
        }),
      ],
    providers: [AuthService,
        JwtStrategy,
        JwtGuard,
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        }
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}