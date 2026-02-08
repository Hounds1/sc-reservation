import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CafeService } from "../sercice/cafe.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { CafeResponse } from "../domain/response/cafe.response";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CafeCreateRequest } from "../domain/request/cafe.request";

@Controller('cafes')
@ApiTags('카페')
export class CafeController {

    constructor(private readonly cafeService: CafeService) {}

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
}