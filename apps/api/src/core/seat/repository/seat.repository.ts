import { Injectable } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Seat, transformToSeat } from "../domain/seat";

@Injectable()
export class SeatRepository {
    constructor(private readonly prisma: PrismaConnector) {}

    async createSeat(seats: Seat[]): Promise<Seat[]> {
        const cafeId = seats[0].cafeId;

        const result = await this.prisma.$transaction(async (tx) => {
            await tx.seats.createMany({
                data: seats.map((seat) => ({
                    cafe_id: seat.cafeId,
                    seat_name: seat.seatName,
                    state: seat.state,
                    location: seat.location,
                    seat_type: seat.seatType,
                    seat_number: seat.seatNumber,
                })),
            });

            return tx.seats.findMany({
                where: { cafe_id: cafeId },
                orderBy: { seat_id: 'desc' },
                take: seats.length,
            });
        });

        return result.map(transformToSeat);
    }
}
