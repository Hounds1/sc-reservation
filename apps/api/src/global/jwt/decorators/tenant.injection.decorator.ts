import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtPayload } from "../strategies/jwt.strategy";

export const TenantInjection = createParamDecorator((data: keyof jwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.user as jwtPayload;

    return data ? tenant?.[data] : tenant;
});