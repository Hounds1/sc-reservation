import { RedisTemplate } from "src/global/redis/redis.template";
import { SessionKeyBuilder } from "../builder/session.key.builder";
import { randomUUID } from "crypto";
import { CreateSessionScript, InvalidateTargetSessionScript, RotateSessionScript } from "./session.script";
import { JwtPolicyProvider } from "src/global/jwt/policy/jwt.policy.provider";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthResponse } from "src/core/auth/domain/response/auth.response";

@Injectable()
export class SessionManager {
    private readonly SESSION_LIMIT_CNT = 5;

    constructor(private readonly redisTemplate: RedisTemplate, private readonly jwtPolicyProvider: JwtPolicyProvider) {}

    async createSession(accountId: number, tokens: AuthResponse, invalidateAll: boolean = false): Promise<string> {
        const accountSessionKey = SessionKeyBuilder.build(accountId);
        if(await this.isLimitExceeded(accountSessionKey)) 
            throw new ConflictException('Session limit exceeded. Please logout and try again.');
        
        const sessionId = randomUUID();
    
        if (invalidateAll) await this.chaseAndInvalidateAllSession(accountSessionKey);

        await this.redisTemplate.execute(
            CreateSessionScript,
            [sessionId, accountSessionKey],
            [JSON.stringify(tokens), this.jwtPolicyProvider.refreshExpiresIn]
        );

        return sessionId;
    }

    async rotateSession(accountId: number
        , tokens: AuthResponse
        , invalidateAll: boolean = false
        , currentSessionId: string): Promise<string> {
            const accountSessionKey = SessionKeyBuilder.build(accountId);
            if (invalidateAll) {
                await this.chaseAndInvalidateAllSession(accountSessionKey);
            }

            const newSessionId = randomUUID();
            await this.redisTemplate.execute(
                RotateSessionScript,
                [newSessionId, accountSessionKey, currentSessionId],
                [JSON.stringify(tokens), this.jwtPolicyProvider.refreshExpiresIn]
            );
            
            return newSessionId;
    }

    async ensureSession(sessionId: string, tokens: AuthResponse): Promise<void> {
        const remainingRedisExpire = await this.redisTemplate.ttl(sessionId);
        if (remainingRedisExpire === -2) throw new UnauthorizedException('Session not found');

        const ttl = remainingRedisExpire > 0 ? remainingRedisExpire : this.jwtPolicyProvider.refreshExpiresIn;

        this.redisTemplate.set(sessionId, JSON.stringify(tokens), ttl);
    }

    async getSession(sessionId: string): Promise<AuthResponse> {
        const session = await this.redisTemplate.get(sessionId);
        return JSON.parse(session);
    }

    async invalidateTargetSession(accountSessionKey: string, sessionId: string): Promise<void> {
        await this.redisTemplate.execute(
            InvalidateTargetSessionScript,
            [accountSessionKey],
            [sessionId]
        );
    }

    async chaseAndInvalidateAllSession(accountSessionKey: string): Promise<void> {
        const sessions = await this.redisTemplate.smembers(accountSessionKey);
        for (const session of sessions) {
            await this.redisTemplate.del(session);
        }
        await this.redisTemplate.del(accountSessionKey);
    }

    async isLimitExceeded(accountSessionKey: string): Promise<boolean> {
        const sessions = await this.redisTemplate.smembers(accountSessionKey);
        return sessions.length >= this.SESSION_LIMIT_CNT;
    }
}