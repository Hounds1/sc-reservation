import { forwardRef, Module } from "@nestjs/common";
import { AccessEnsureMiddleware } from "./middleware/access.ensure.middleware";
import { AuthModule } from "src/core/auth/auth.module";

@Module({
    imports: [
        forwardRef(() => AuthModule),
    ],
    providers: [
        AccessEnsureMiddleware
    ],
    exports: [AccessEnsureMiddleware]
})
export class AccessEnsureModule {
}