import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InternalAccountService } from "src/core/account/service/internal.account.service";
import { AuthRequest, ReissueRequest } from "../domain/request/auth.request";
import { AuthResponse, ContainedSession } from "../domain/response/auth.response";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { InternalAccountDelivery } from "src/core/account/domain/internal/account.internal.delivery";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { RedisTemplate } from "src/global/redis/redis.template";
import { EnsuredSessionDelivery, InternalSessionDelivery } from "../domain/element/auth.element";
import { SessionKeyBuilder } from "../../../global/session/builder/session.key.builder";
import { JwtPolicyProvider } from "src/global/jwt/policy/jwt.policy.provider";
import { SessionManager } from "src/global/session/manager/session.manager";

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
    constructor(private readonly internalAccountService: InternalAccountService
        , private readonly jwtService: JwtService
        , private readonly redisTemplate: RedisTemplate
        , private readonly jwtPolicyProvider: JwtPolicyProvider
        , private readonly sessionManager: SessionManager) {}

    async auth(request: AuthRequest): Promise<ContainedSession> {
        const accountMeta = await this.validateAndGetAccount(request.email, request.password);

        const payload = {
            accountId: accountMeta.accountId,
            email: accountMeta.email,
            role: accountMeta.role,
            status: accountMeta.status,
        }

        const accessToken = await this.jwtService.signAsync(payload, 
            { expiresIn: this.jwtPolicyProvider.accessExpiresIn,
                 secret: this.jwtPolicyProvider.accessKey 
            });

        const refreshToken = await this.jwtService.signAsync(payload, 
            { expiresIn: this.jwtPolicyProvider.refreshExpiresIn, 
                secret: this.jwtPolicyProvider.refreshKey 
            });

        const now = DatetimeProvider.now();

        const actual: AuthResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + this.jwtPolicyProvider.accessExpiresIn,
            refreshTokenExpiresAt: now + this.jwtPolicyProvider.refreshExpiresIn,
        }

        const sessionId = await this.sessionManager.createSession(accountMeta.accountId, actual, false);
        
        return {
            sessionId: sessionId,
            sessionCreatedAt: now,
            sessionExpiresAt: actual.refreshTokenExpiresAt,
        }
    }

    // 명시적인 세션 로테이트
    async reissue(request: ReissueRequest, currentSessionId: string): Promise<ContainedSession> {
        const payload = await this.jwtService.verifyAsync(request.refreshToken, 
            { secret: this.jwtPolicyProvider.refreshKey }) as RefreshPayload;

        if (this.isExpired(payload.exp)) throw new UnauthorizedException('Refresh token expired');

        const { exp, iat, ...payloadForSign } = payload;
        
        const accessToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: this.jwtPolicyProvider.accessExpiresIn, 
                secret: this.jwtPolicyProvider.accessKey });

        const now = DatetimeProvider.now();
        const refreshExpiresIn = Math.abs(payload.exp - now);
        const refreshToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: refreshExpiresIn,
                secret: this.jwtPolicyProvider.refreshKey });

        const actual = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + this.jwtPolicyProvider.accessExpiresIn,
            refreshTokenExpiresAt: now + refreshExpiresIn,
        }

        const sessionId = await this.sessionManager.rotateSession(payload.accountId, actual, false, currentSessionId);

        return {
            sessionId: sessionId,
            sessionCreatedAt: now,
            sessionExpiresAt: now + this.jwtPolicyProvider.refreshExpiresIn,
        }
    }

    // 미들웨어 주관의 Access 갱신
    async ensure(session: InternalSessionDelivery): Promise<EnsuredSessionDelivery> {
        const payload = await this.jwtService.verifyAsync(session.refreshToken, 
            { secret: this.jwtPolicyProvider.refreshKey }) as RefreshPayload;

        if (this.isExpired(payload.exp)) throw new UnauthorizedException('Refresh token expired');

        const { exp, iat, ...payloadForSign } = payload;
        const accessToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: this.jwtPolicyProvider.accessExpiresIn, 
                secret: this.jwtPolicyProvider.accessKey });

        const now = DatetimeProvider.now();
        const actual = {
            accessToken: accessToken,
            refreshToken: session.refreshToken,
            accessTokenExpiresAt: now + this.jwtPolicyProvider.accessExpiresIn,
            refreshTokenExpiresAt: payload.exp
        }

        await this.sessionManager.ensureSession(session.sessionId, actual);

        return {
            sessionId: session.sessionId,
            accessToken: accessToken,
        }
    }

    // 로그아웃 (현재 세션 말소)
    async invalidateSession(accountId: number, sessionId: string): Promise<void> {
        const accountSessionKey = SessionKeyBuilder.build(accountId);
        await this.sessionManager.invalidateTargetSession(accountSessionKey, sessionId);
    }

    async validateAndGetAccount(email: string, password: string): Promise<InternalAccountDelivery> {
        const account = await this.internalAccountService.internalAccountDelivery(email);
        
        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');
        return account;
    }

    async chaseAndInvalidateAllSession(accountSessionKey: string) : Promise<void> {
        const oldSessionIds = await this.redisTemplate.smembers(accountSessionKey);
        for (const oldSessionId of oldSessionIds) {
            await this.redisTemplate.del(oldSessionId);
        }
        await this.redisTemplate.del(accountSessionKey);
    }

    isExpired(exp: number): boolean {
        const now = DatetimeProvider.now();
        return now >= exp;
    }

    parseKey(key: string): Buffer {
        return Buffer.from(key, 'base64');
    }
}