import { applyDecorators, UseGuards } from "@nestjs/common";
import { ContainingSessionGuard } from "../guards/containing.session.guard";

export function RejectIfContaining() {
    return applyDecorators(
        UseGuards(ContainingSessionGuard)
    );
}