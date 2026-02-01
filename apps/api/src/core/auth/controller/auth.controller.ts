import { Body, Controller, Delete, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { AuthRequest, ReissueRequest } from "../domain/request/auth.request";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiWrappedResponse, ApiWrappedVoidResponse } from "src/global/swagger/wrapped.response.decorator";
import { ContainedSession } from "../domain/response/auth.response";
import { PublicEntrypoint } from "../decorators/public.entrypoint";
import { TenantInjection } from "src/global/jwt/decorators/tenant.injection.decorator";
import { jwtPayload } from "src/global/jwt/strategies/jwt.strategy";
import { RetrieveSession } from "src/global/session/decorators/session.retrieve.decorator";
import { RejectIfContaining } from "src/global/session/decorators/contain.rejection.decorator";

@Controller('auth')
@ApiTags('로그인')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('public/login')
    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: AuthRequest })
    @ApiWrappedResponse(ContainedSession)
    @RejectIfContaining()
    @PublicEntrypoint()
    async login(@Body() request: AuthRequest): Promise<ContainedSession> {
        return this.authService.auth(request);
    }

    @Post('public/reissue')
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiBody({ type: ReissueRequest })
    @ApiWrappedResponse(ContainedSession)
    async reissue(@Body() request: ReissueRequest, @RetrieveSession() sessionId: string): Promise<ContainedSession> {
        return this.authService.reissue(request, sessionId);
    }

    @Delete('invalidate')
    @ApiOperation({ summary: '로그아웃' })
    @ApiWrappedVoidResponse()  
    async logout(@TenantInjection() tenant: jwtPayload, @RetrieveSession() sessionId: string): Promise<void> {
        return this.authService.invalidateSession(tenant.accountId, sessionId);
    }
}