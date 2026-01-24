import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, Max } from "class-validator";

export abstract class PaginationParams {
    @ApiProperty({
        description: 'The page number',
        example: 1,
    })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Page is required' })
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Page must be a number' })
    page: number;

    @ApiProperty({
        description: 'The limit per page',
        example: 10,
    })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Limit is required' })
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Limit must be a number' })
    @Min(1, { message: 'Limit must be greater than 0' })
    @Max(100, { message: 'Limit must be less than 100' })
    limit: number;
}