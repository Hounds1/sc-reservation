import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthRequest {
    @ApiProperty({
        description: 'The email of the account',
        example: 'test@example.com',
    })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'The password of the account',
        example: 'password',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}

export class ReissueRequest {
    @ApiProperty({
        description: 'The refresh token',
        example: 'refresh-token',
    })
    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}