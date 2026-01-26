import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { AuthRequest, ReissueRequest } from "../domain/request/auth.request";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { AuthResponse } from "../domain/response/auth.response";
import { PublicEntrypoint } from "../decorators/public.entrypoint";

@Controller()
@ApiTags('로그인')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('public/auth')
    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: AuthRequest })
    @ApiWrappedResponse(AuthResponse)
    @PublicEntrypoint()
    async login(@Body() request: AuthRequest): Promise<AuthResponse> {
        return this.authService.auth(request);
    }

    @Post('public/reissue')
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiBody({ type: ReissueRequest })
    @ApiWrappedResponse(AuthResponse)
    @PublicEntrypoint()
    async reissue(@Body() request: ReissueRequest): Promise<AuthResponse> {
        return this.authService.reissue(request);
    }
}