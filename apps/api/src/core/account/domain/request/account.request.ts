import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { PaginationParams } from "src/global/pagination/param/pagenation-params";

export class CreateAccountRequest {
    @ApiProperty({
        description: 'The email of the account',
        example: 'test@example.com',
    })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'The name of the account',
        example: 'John Doe',
    })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(1, { message: 'Name must be at least 3 characters long' })
    @MaxLength(30, { message: 'Name must be less than 255 characters long' })
    name: string;

    @ApiProperty({
        description: 'The password of the account',
        example: 'password',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    @ApiProperty({
        description: 'The display name of the account',
        example: 'John Doe',
    })
    @IsNotEmpty({ message: 'Display name is required' })
    @IsString({ message: 'Display name must be a string' })
    @MinLength(1, { message: 'Display name must be at least 3 characters long' })
    @MaxLength(30, { message: 'Display name must be less than 255 characters long' })
    displayName: string;
}

export class PaginatedAccountSearchRequest extends PaginationParams {
    
}