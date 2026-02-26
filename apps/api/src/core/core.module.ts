import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth/auth.module";
import { CafeModule } from "./cafe/cafe.module";
import { SeatModule } from "./seat/seat.module";

@Module({
    imports: [
        AccountModule,
        AuthModule,
        CafeModule,
        SeatModule,
    ],
    exports: [
        AuthModule,
    ]
})
export class CoreModule {}