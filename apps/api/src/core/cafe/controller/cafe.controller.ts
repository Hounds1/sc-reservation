import { Body, Controller, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CafeService } from "../sercice/cafe.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { CafePriceResponse, CafeResponse } from "../domain/response/cafe.response";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CafeCreateRequest, CafeModifyRequest, CafePriceCreateRequest } from "../domain/request/cafe.request";

@Controller('cafes')
@ApiTags('카페')
export class CafeController {

    constructor(private readonly cafeService: CafeService) {}

    @Get()
    @ApiOperation({ summary: '카페 목록 조회' })
    @ApiWrappedResponse(CafeResponse)
    async getAllCafes(): Promise<CafeResponse[]> {
        return this.cafeService.getAllCafes();
    }

    @Get(':cafeId')
    @ApiOperation({ summary: '카페 상세 조회' })
    @ApiWrappedResponse(CafeResponse)
    async getCafeById(@Param('cafeId') cafeId: number): Promise<CafeResponse> {
        return this.cafeService.getCafeById(cafeId);
    }

    @Post()
    @ApiOperation({ summary: '카페 생성' })
    @ApiWrappedResponse(CafeResponse)
    @UseInterceptors(FilesInterceptor('images', 10))
    async createCafe(
        @Body() body: CafeCreateRequest,
        @UploadedFiles() images: Express.Multer.File[],
        ): Promise<CafeResponse> {
        const request = { ...body, images };
        return this.cafeService.createCafe(request);
    }

    @Put(':cafeId')
    @ApiOperation({ summary: '카페 수정' })
    @ApiWrappedResponse(CafeResponse)
    @UseInterceptors(FilesInterceptor('images', 10))
    async modifyCafe(
        @Param('cafeId') cafeId: number,
        @Body() body: CafeModifyRequest,
        @UploadedFiles() images: Express.Multer.File[],
    ): Promise<CafeResponse> {
        const request = { ...body, cafeId, images };
        return this.cafeService.modifyCafe(request);
    }

    @Post(':cafeId/prices')
    @ApiOperation({ summary: '카페 가격 생성' })
    @ApiWrappedResponse(CafePriceResponse)
    async createCafePrice(
        @Param('cafeId') cafeId: number,
        @Body() body: CafePriceCreateRequest[]
    ): Promise<CafeResponse> {
        body.forEach(price => price.cafeId = cafeId);
        return this.cafeService.createCafePrice(body);
    }
}