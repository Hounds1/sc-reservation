import { Module } from "@nestjs/common";
import { SeatRepository } from "./repository/seat.repository";
import { SeatController } from "./controller/seat.controller";
import { SeatService } from "./service/seat.service";

@Module({
    controllers: [SeatController],
    providers: [SeatService, SeatRepository],
})
export class SeatModule {

}