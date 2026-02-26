import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

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


export class CafeModifyRequest {

    @ApiHideProperty()
    _cafeId: number;
    set cafeId(value: number) {
        this._cafeId = value;
    }
    
    get cafeId(): number {
        return this._cafeId;
    }

    
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

    @ApiProperty({
        description: 'The image ids to delete',
        example: [1, 2, 3],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value == null || value === '') return [];
        const arr = Array.isArray(value) ? value : String(value).split(',');
        return arr
          .map(v => Number(v))
          .filter(n => Number.isFinite(n));
      })
    @IsArray({ message: 'Delete image ids must be an array' })
    deleteImageIds?: number[];
}

export class CafeModifyRequestWithImages extends CafeModifyRequest {
    images: Express.Multer.File[];
}

export class CafePriceCreateRequest {
    @ApiProperty({
        description: 'The amount subtotal of the price',
        example: 10000,
    })
    @IsNotEmpty({ message: 'Amount subtotal is required' })
    @IsNumber({}, { message: 'Amount subtotal must be a number' })
    amountSubtotal: number;

    @ApiProperty({
        description: 'The amount tax of the price',
        example: 1000,
    })
    @IsNotEmpty({ message: 'Amount tax is required' })
    @IsNumber({}, { message: 'Amount tax must be a number' })
    amountTax: number;

    @ApiProperty({
        description: 'The amount total of the price',
        example: 11000,
    })
    @IsNotEmpty({ message: 'Amount total is required' })
    @IsNumber({}, { message: 'Amount total must be a number' })
    amountTotal: number;

    @ApiProperty({
        description: 'The duration of the price',
        example: 1,
    })
    @IsNotEmpty({ message: 'Duration is required' })
    @IsNumber({}, { message: 'Duration must be a number' })
    duration: number;

    @ApiHideProperty()
    _cafeId : number;

    set cafeId(value: number) {
        this._cafeId = value;
    }
    get cafeId(): number {
        return this._cafeId;
    }
}


export class CafeBadgeCreateRequest {
    
    @ApiHideProperty()
    _cafeId : number;
    
    set cafeId(value: number) {
        this._cafeId = value;
    }
    
    get cafeId(): number {
        return this._cafeId;
    }

    @ApiProperty({
        description: 'The title of the badge',
        example: 'Best Cafe',
    })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(1, { message: 'Title must be at least 3 characters long' })
    @MaxLength(13, { message: 'Title must be less than 255 characters long' })
    title: string;

    @ApiProperty({
        description: 'The background color of the badge',
        example: '#000000',
    })
    @Matches(/^#([0-9a-fA-F]{6})$/, { message: 'Background color must be a valid hex color' })
    @IsNotEmpty({ message: 'Background color is required' })
    @IsString({ message: 'Background color must be a string' })
    @MinLength(1, { message: 'Background color must be at least 3 characters long' })
    @MaxLength(8, { message: 'Background color must be less than 255 characters long' })
    bgColor: string;
    
    @ApiProperty({
        description: 'The text color of the badge',
        example: '#FFFFFF',
    })
    @Matches(/^#([0-9a-fA-F]{6})$/, { message: 'Text color must be a valid hex color' })
    @IsNotEmpty({ message: 'Text color is required' })
    @IsString({ message: 'Text color must be a string' })
    @MinLength(1, { message: 'Text color must be at least 3 characters long' })
    @MaxLength(8, { message: 'Text color must be less than 255 characters long' })
    txtColor: string;
}