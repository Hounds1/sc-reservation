import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AccountModule } from "src/core/account/account.module";
import { JwtPolicyProvider } from "./policy/jwt.policy.provider";

@Module({
    imports: [
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService): JwtModuleOptions => ({
            secret: config.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: config.get<number>('JWT_EXPIRES_IN', 900) ?? 900,
            },
          }),
        }),
        AccountModule,
      ],
    providers: [
        JwtStrategy,
        JwtGuard,
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        JwtPolicyProvider,
    ],
    exports: [
        JwtModule,
        JwtPolicyProvider,
    ]
})
export class JwtGlobalModule {
}