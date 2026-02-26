import { IsEnum, IsNotEmpty, IsNumber, Matches, IsString } from "class-validator";
import { SeatState, SeatType } from "../seat";
import { ApiProperty } from "@nestjs/swagger";

export class SeatCreateRequest {
    _cafeId: number;
    set cafeId(value: number) {
        this._cafeId = value;
    }
    get cafeId(): number {
        return this._cafeId;
    }

    @ApiProperty({
        description: '좌석 이름',
        example: '좌석1',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9가-힣\s]+$/)
    seatName: string;

    @ApiProperty({
        description: '좌석 상태',
        example: 'AVAILABLE',
    })
    @IsEnum(SeatState)
    state: SeatState;

    @ApiProperty({
        description: '좌석 위치',
        example: '1층 1번 좌석',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9가-힣\s]+$/)
    location: string;

    @ApiProperty({
        description: '좌석 타입',
        example: 'NORMAL',
    })
    @IsEnum(SeatType)
    seatType: SeatType;

    @ApiProperty({
        description: '좌석 번호(필요 시 별도 식별용)',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    // Additional Number
    // Id 외의 별도 식별 필요 시 사용
    seatNumber: number;
}