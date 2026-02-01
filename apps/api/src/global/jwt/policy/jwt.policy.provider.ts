import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtPolicyProvider {
    private readonly ACCESS_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN ?? 900);
    private readonly REFRESH_EXPIRES_IN = Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800);
    private readonly ACCESS_KEY = Buffer.from(process.env.JWT_SECRET ?? '', 'base64');
    private readonly REFRESH_KEY = Buffer.from(process.env.JWT_REFRESH_SECRET ?? '', 'base64');

    get accessExpiresIn(): number {
        return this.ACCESS_EXPIRES_IN;
    }

    get refreshExpiresIn(): number {
        return this.REFRESH_EXPIRES_IN;
    }

    get accessKey(): Buffer {
        return this.ACCESS_KEY;
    }
    
    get refreshKey(): Buffer {
        return this.REFRESH_KEY;
    }
}