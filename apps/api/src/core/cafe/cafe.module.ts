import { Module } from "@nestjs/common";
import { CafeRepository } from "./repository/cafe.repository";
import { CafeService } from "./sercice/cafe.service";
import { CafeController } from "./controller/cafe.controller";
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [StorageModule],
    providers: [CafeRepository, CafeService],
    exports: [CafeRepository, CafeService],
    controllers: [CafeController],
})
export class CafeModule {}