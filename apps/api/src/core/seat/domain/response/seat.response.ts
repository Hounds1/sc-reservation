import { Seat, SeatState, SeatType } from "../seat";

export class SeatResponse {
    seatId: number;
    cafeId: number;
    seatName: string;
    state: SeatState;
    location: string;
    seatType: SeatType;
    seatNumber: number;
}

// Entity -> Response
export function transformToResponse(seat: Seat): SeatResponse {
    return {
        seatId: seat.seatId,
        cafeId: seat.cafeId,
        seatName: seat.seatName,
        state: seat.state,
        location: seat.location,
        seatType: seat.seatType,
        seatNumber: seat.seatNumber,
    }
}