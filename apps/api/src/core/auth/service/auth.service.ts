import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InternalAccountService } from "src/core/account/service/internal.account.service";
import { AuthRequest, ReissueRequest } from "../domain/request/auth.request";
import { AuthResponse } from "../domain/response/auth.response";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { InternalAccountDelivery } from "src/core/account/domain/internal/account.internal.delivery";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";

type RefreshPayload = {
    accountId: number;
    email: string;
    role: string;
    status: string;
    exp: number;
    iat?: number;
}

@Injectable()
export class AuthService {
    constructor(private readonly internalAccountService: InternalAccountService, private readonly jwtService: JwtService) {}

    private readonly expiresIn: number = Number(process.env.JWT_EXPIRES_IN ?? 900);
    private readonly refreshExpiresIn: number = Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800);
    private readonly accessKey: Buffer = this.parseKey(process.env.JWT_SECRET ?? '');
    private readonly refreshKey: Buffer = this.parseKey(process.env.JWT_REFRESH_SECRET ?? '');

    async auth(request: AuthRequest): Promise<AuthResponse> {
        const accountMeta = await this.validateAndGetAccount(request.email, request.password);

        const payload = {
            accountId: accountMeta.accountId,
            email: accountMeta.email,
            role: accountMeta.role,
            status: accountMeta.status,
        }

        const accessToken = await this.jwtService.signAsync(payload, 
            { expiresIn: this.expiresIn,
                 secret: this.accessKey 
            });

        const refreshToken = await this.jwtService.signAsync(payload, 
            { expiresIn: this.refreshExpiresIn, 
                secret: this.refreshKey });

        const now = DatetimeProvider.now();
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + this.expiresIn,
            refreshTokenExpiresAt: now + this.refreshExpiresIn,
        }
    }

    async reissue(request: ReissueRequest): Promise<AuthResponse> {
        const payload = await this.jwtService.verifyAsync(request.refreshToken, 
            { secret: this.refreshKey }) as RefreshPayload;

        const now = DatetimeProvider.now();
        if (now >= payload.exp) throw new UnauthorizedException('Refresh token expired');

        const { exp, iat, ...payloadForSign } = payload;
        
        const accessToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: this.expiresIn, 
                secret: this.accessKey });

        return {
            accessToken: accessToken,
            refreshToken: request.refreshToken,
            accessTokenExpiresAt: now + this.expiresIn,
            refreshTokenExpiresAt: payload.exp,
        }
    }

    async validateAndGetAccount(email: string, password: string): Promise<InternalAccountDelivery> {
        const account = await this.internalAccountService.internalAccountDelivery(email);
        
        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');
        return account;
    }

    parseKey(key: string): Buffer {
        return Buffer.from(key, 'base64');
    }
}