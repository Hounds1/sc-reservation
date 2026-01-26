import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccountInternalService } from "src/core/account/service/account.internal.service";

export type jwtPayload = {
    accountId: number;
    email: string;
    role: string;
    status: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService, private readonly accountInternalService: AccountInternalService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(configService.get<string>('JWT_SECRET') ?? 'default-secret', 'base64'),
        });
    }

    async validate(payload: jwtPayload): Promise<jwtPayload> {
        const account = await this.accountInternalService.internalAccountDelivery(payload.email);
        if (account.status != 'ACTIVE') throw new UnauthorizedException('Account is not activated');

        return { accountId: payload.accountId, email: payload.email, role: account.role, status: account.status };
    }
}