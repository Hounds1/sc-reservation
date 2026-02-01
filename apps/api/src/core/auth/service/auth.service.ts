import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InternalAccountService } from "src/core/account/service/internal.account.service";
import { AuthRequest, ReissueRequest } from "../domain/request/auth.request";
import { ContainedSession } from "../domain/response/auth.response";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { InternalAccountDelivery } from "src/core/account/domain/internal/account.internal.delivery";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { RedisTemplate } from "src/global/redis/redis.template";
import { randomUUID } from "crypto";
import { EnsuredSessionDelivery, InternalSessionDelivery } from "../domain/element/auth.element";
import { SessionKeyBuilder } from "../units/session.key.builder";
import { CreateSessionScript } from "../units/session.script";
import { jwtPayload } from "src/global/jwt/strategies/jwt.strategy";

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
        , private readonly redisTemplate: RedisTemplate) {}

    private readonly expiresIn: number = Number(process.env.JWT_EXPIRES_IN ?? 900);
    private readonly refreshExpiresIn: number = Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800);
    private readonly accessKey: Buffer = this.parseKey(process.env.JWT_SECRET ?? '');
    private readonly refreshKey: Buffer = this.parseKey(process.env.JWT_REFRESH_SECRET ?? '');

    async auth(request: AuthRequest): Promise<ContainedSession> {
        const accountMeta = await this.validateAndGetAccount(request.email, request.password);

        const accountSessionKey = SessionKeyBuilder.build(accountMeta.accountId);
        await this.chaseAndInvalidateAllSession(accountSessionKey);

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

        const actual = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + this.expiresIn,
            refreshTokenExpiresAt: now + this.refreshExpiresIn,
        }

        const sessionId = randomUUID();

        await this.redisTemplate.execute(
            CreateSessionScript,
            [sessionId, accountSessionKey],
            [JSON.stringify(actual), this.refreshExpiresIn]
        );
        
        return {
            sessionId: sessionId,
            sessionCreatedAt: now,
            sessionExpiresAt: now + this.expiresIn,
        }
    }

    // 명시적인 세션 로테이트
    async reissue(request: ReissueRequest): Promise<ContainedSession> {
        const payload = await this.jwtService.verifyAsync(request.refreshToken, 
            { secret: this.refreshKey }) as RefreshPayload;

        if (this.isExpired(payload.exp)) throw new UnauthorizedException('Refresh token expired');

        const { exp, iat, ...payloadForSign } = payload;
        
        const accessToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: this.expiresIn, 
                secret: this.accessKey });

        const now = DatetimeProvider.now();
        const refreshExpiresIn = Math.abs(payload.exp - now);
        const refreshToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: refreshExpiresIn,
                secret: this.refreshKey });

        const actual = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: now + this.expiresIn,
            refreshTokenExpiresAt: now + refreshExpiresIn,
        }

        const sessionKey = SessionKeyBuilder.build(payload.accountId);
        await this.chaseAndInvalidateAllSession(sessionKey);

        
        const sessionId = randomUUID();
        await this.redisTemplate.execute(
            CreateSessionScript,
            [sessionId, sessionKey],
            [JSON.stringify(actual), this.refreshExpiresIn]
        );

        return {
            sessionId: sessionId,
            sessionCreatedAt: now,
            sessionExpiresAt: now + this.refreshExpiresIn,
        }
    }

    // 미들웨어 주관의 Access 갱신
    async ensure(session: InternalSessionDelivery): Promise<EnsuredSessionDelivery> {
        const payload = await this.jwtService.verifyAsync(session.refreshToken, 
            { secret: this.refreshKey }) as RefreshPayload;

        if (this.isExpired(payload.exp)) throw new UnauthorizedException('Refresh token expired');

        const { exp, iat, ...payloadForSign } = payload;
        const accessToken = await this.jwtService.signAsync(payloadForSign, 
            { expiresIn: this.expiresIn, 
                secret: this.accessKey });

        const now = DatetimeProvider.now();
        const actual = {
            accessToken: accessToken,
            refreshToken: session.refreshToken,
            accessTokenExpiresAt: now + this.expiresIn,
            refreshTokenExpiresAt: payload.exp
        }

        const remainingRedisExpire = await this.redisTemplate.ttl(session.sessionId);
        if (remainingRedisExpire === -2) throw new UnauthorizedException('Session not found');

        const ttl = remainingRedisExpire > 0 ? remainingRedisExpire : this.refreshExpiresIn;

        this.redisTemplate.set(session.sessionId, JSON.stringify(actual), ttl);

        return {
            sessionId: session.sessionId,
            accessToken: accessToken,
        }
    }

    // 로그아웃 (전체 세션 말소)
    async invalidateSession(tenent: jwtPayload): Promise<void> {
        const sessionKey = SessionKeyBuilder.build(tenent.accountId);
        await this.chaseAndInvalidateAllSession(sessionKey);
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