import { Injectable } from "@nestjs/common";
import { SeatCreateRequest } from "../domain/request/seat.request";
import { SeatResponse, transformToResponse } from "../domain/response/seat.response";
import { SeatRepository } from "../repository/seat.repository";
import { transformToEntity } from "../domain/seat";
import { TransactionManager } from "src/global/prisma/transaction.manager";

@Injectable()
export class SeatService {
    constructor(
        private readonly seatRepository: SeatRepository,
        private readonly txManager: TransactionManager,
    ) {}

    async createSeat(seats: SeatCreateRequest[]): Promise<SeatResponse[]> {
        const entities = seats.map((seat) => transformToEntity(seat));

        return this.txManager.run(async () => {
            const createdSeats = await this.seatRepository.createSeat(entities);
            return createdSeats.map((seat) => transformToResponse(seat));
        });
    }
}
