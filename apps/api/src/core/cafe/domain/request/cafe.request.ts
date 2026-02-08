import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CafeCreateRequest {

    @ApiProperty({
        description: 'The business name of the cafe',
        example: 'Study Cafe',
    })
    @IsNotEmpty({ message: 'Business name is required' })
    @IsString({ message: 'Business name must be a string' })
    @MinLength(1, { message: 'Business name must be at least 3 characters long' })
    @MaxLength(255, { message: 'Business name must be less than 255 characters long' })
    businessName: string;

    @ApiProperty({
        description: 'The address1 of the cafe',
        example: '서울특별시 강남구 삼성동',
    })
    @IsNotEmpty({ message: 'Address1 is required' })
    @IsString({ message: 'Address1 must be a string' })
    @MinLength(1, { message: 'Address1 must be at least 3 characters long' })
    @MaxLength(255, { message: 'Address1 must be less than 255 characters long' })
    address1: string;
    
    @ApiProperty({
        description: 'The address2 of the cafe',
        example: '삼성로',
    })
    @IsNotEmpty({ message: 'Address2 is required' })
    @IsString({ message: 'Address2 must be a string' })
    @MinLength(1, { message: 'Address2 must be at least 3 characters long' })
    @MaxLength(255, { message: 'Address2 must be less than 255 characters long' })
    address2: string;
}

export class CafeCreateRequestWithImages extends CafeCreateRequest {
    images: Express.Multer.File[];
}