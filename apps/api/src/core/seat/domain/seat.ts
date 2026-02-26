import { seatsModel } from "generated/prisma/models";
import { SeatCreateRequest } from "./request/seat.request";

export enum SeatState {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    OTHER = "OTHER",
}

export enum SeatType {
    NORMAL = "NORMAL",
    WINDOW_SIDE = "WINDOW_SIDE",
    SILENT = "SILENT",
    GROUP = "GROUP",
    OTHER = "OTHER",
}

// Entity
export class Seat {
    seatId: number;
    cafeId: number;
    seatName: string;
    state: SeatState;
    location: string;
    seatType: SeatType;
    seatNumber: number;
}

// Request -> Entity
export function transformToEntity(request: SeatCreateRequest): Seat {
    return {
        seatId: null,
        cafeId: request.cafeId,
        seatName: request.seatName,
        state: request.state,
        location: request.location,
        seatType: request.seatType,
        seatNumber: request.seatNumber,
    }
}

// Prisma Model -> Entity
export function transformToSeat(seat: seatsModel): Seat {
    return {
        seatId: Number(seat.seat_id),
        cafeId: Number(seat.cafe_id),
        seatName: seat.seat_name,
        state: seat.state as SeatState,
        location: seat.location,
        seatType: seat.seat_type as SeatType,
        seatNumber: Number(seat.seat_number),
    }
}