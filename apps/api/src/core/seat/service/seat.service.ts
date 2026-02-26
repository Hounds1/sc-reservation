import { Injectable } from "@nestjs/common";
import { SeatCreateRequest } from "../domain/request/seat.request";
import { SeatResponse, transformToResponse } from "../domain/response/seat.response";
import { SeatRepository } from "../repository/seat.repository";
import { transformToEntity } from "../domain/seat";

@Injectable()
export class SeatService {
    constructor(private readonly seatRepository: SeatRepository) {}

    async createSeat(seats: SeatCreateRequest[]): Promise<SeatResponse[]> {
        const entities = seats.map((seat) => transformToEntity(seat));
        
        const createdSeats = await this.seatRepository.createSeat(entities);
        return createdSeats.map((seat) => transformToResponse(seat));
    }
}