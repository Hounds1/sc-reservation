import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
    @ApiProperty({
        description: 'The token of the account',
        example: 'token',
    })
    accessToken: string;
    
    @ApiProperty({
        description: 'The refresh token of the account',
        example: 'refreshToken',
    })
    refreshToken: string;
    
    @ApiProperty({
        description: 'The expiration time of the token',
        example: 1716796800,
    })
    accessTokenExpiresAt: number;

    @ApiProperty({
        description: 'The expiration time of the refresh token',
        example: 1716796800,
    })
    refreshTokenExpiresAt: number;
}

export class ContainedSession {
    @ApiProperty({
        description: 'Session Id',
        example: 'uuid',
    })
    sessionId: string;

    @ApiProperty({
        description: 'Session Created At',
        example: 1716796800,
    })
    sessionCreatedAt: number;

    @ApiProperty({
        description: 'Session Expires At',
        example: 1716796800,
    })
    sessionExpiresAt: number;
}