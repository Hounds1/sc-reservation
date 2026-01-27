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