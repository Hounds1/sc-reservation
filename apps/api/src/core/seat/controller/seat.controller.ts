import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SeatService } from "../service/seat.service";
import { ApiWrappedArrayResponse, ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { SeatResponse } from "../domain/response/seat.response";
import { SeatCreateRequest } from "../domain/request/seat.request";

@Controller('seats')
@ApiTags('좌석')
export class SeatController {

    constructor(private readonly seatService: SeatService) {}

    @Post(':cafeId')
    @ApiOperation({ summary: '좌석 생성' })
    @ApiWrappedArrayResponse([SeatResponse])
    async createSeat(
        @Param('cafeId') cafeId: number,
        @Body() body: SeatCreateRequest[]
    ): Promise<SeatResponse[]> {
        body.forEach((seat) => {
            seat.cafeId = cafeId;
        });

        return await this.seatService.createSeat(body);
    }
}