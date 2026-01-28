import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response, } from "express";
import { AuthService } from "src/core/auth/service/auth.service";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { RedisTemplate } from "src/global/redis/redis.template";
import { SESSION_COOKIE_NAME, AUTHORIZATION_HEADER_NAME } from "@global/contracts";

type RequestWithCookies = Request & { cookies?: Record<string, string> };

@Injectable()
export class AccessEnsureMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService
        , private readonly redisTemplate: RedisTemplate
    ) {}

    async use(req: RequestWithCookies, res: Response, next: NextFunction): Promise<void> {
        const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
        if (!sessionId) return next();

        const raw = await this.redisTemplate.get(sessionId);
        if (!raw) return next();

        let actual: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresAt: number;
            refreshTokenExpiresAt: number;
        }

        try {
            actual = JSON.parse(raw)
        } catch {
            return next();
        }

        const now = DatetimeProvider.now();
        let accessToken = actual.accessToken;

        if (actual.accessTokenExpiresAt <= now) {
            try {
                const ensured = await this.authService.ensure({
                    sessionId: sessionId,
                    refreshToken: actual.refreshToken,
                });
                accessToken = ensured.accessToken;
            } catch {
                return next();
            }
        }

        req.headers[AUTHORIZATION_HEADER_NAME] = `Bearer ${accessToken}`;
        next();
    }
}