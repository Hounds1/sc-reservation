import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountInternalService } from "src/core/account/service/account.internal.service";
import { AuthRequest } from "../domain/request/auth.request";
import { AuthResponse } from "../domain/response/auth.response";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { InternalAccountDelivery } from "src/core/account/domain/internal/account.internal.delivery";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";

@Injectable()
export class AuthService {
    constructor(private readonly accountInternalService: AccountInternalService, private readonly jwtService: JwtService) {}

    async auth(request: AuthRequest): Promise<AuthResponse> {
        const accountMeta = await this.validateAndGetAccount(request.email, request.password);

        const payload = {
            accountId: accountMeta.accountId,
            email: accountMeta.email,
            role: accountMeta.role,
            status: accountMeta.status,
        }
        const expiresIn: number = Number(process.env.JWT_EXPIRES_IN ?? 900);
        const refreshExpiresIn: number = Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800);
        const accessKey = await this.parseKey(process.env.JWT_SECRET ?? '');
        const refreshKey = await this.parseKey(process.env.JWT_REFRESH_SECRET ?? '');

        
        const accessToken = await this.jwtService.signAsync(payload, 
            { expiresIn: expiresIn,
                 secret: accessKey 
            });

        const refreshToken = await this.jwtService.signAsync(payload, 
            { expiresIn: refreshExpiresIn, 
                secret: refreshKey });

        const now = DatetimeProvider.now();

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + expiresIn,
            refreshTokenExpiresAt: now + refreshExpiresIn,
        }
    }

    async validateAndGetAccount(email: string, password: string): Promise<InternalAccountDelivery> {
        const account = await this.accountInternalService.internalAccountDelivery(email);
        
        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');
        return account;
    }

    async parseKey(key: string): Promise<Buffer> {
        return Buffer.from(key, 'base64');
    }
}