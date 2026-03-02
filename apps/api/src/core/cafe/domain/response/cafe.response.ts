import { Cafe } from "../cafe";
import { SeatState } from "src/core/seat/domain/seat";

export class CafeSeatSummary {
    totalSeats: number;
    availableSeats: number;
    usageRate: number;
}

export class CafeResponse {
    cafeId: number;
    businessName: string;
    address1: string;
    address2: string;
    createdAt: number;
    updatedAt: number | null;
    images: {
        imageId: number;
        imageSrc: string;
        originName: string;
        identifiedName: string;
        extension: string;
    }[];
    prices: {
        priceId: number;
        amountSubtotal: number;
        amountTax: number;
        amountTotal: number;
    }[];
    badges: {
        badgeId: number;
        title: string;
        bgColor: string;
        txtColor: string;
    }[];
    seatSummary: CafeSeatSummary;
}

export function transformToResponse(cafe: Cafe): CafeResponse {
    return {
        cafeId: cafe.cafeId,
        businessName: cafe.businessName,
        address1: cafe.address1,
        address2: cafe.address2,
        createdAt: cafe.createdAt,
        updatedAt: cafe.updatedAt,
        images: cafe.images.map((image) => ({
            imageId: image.imageId,
            imageSrc: image.imageSrc,
            originName: image.originName,
            identifiedName: image.identifiedName,
            extension: image.extension,
        })),
        prices: cafe.prices.map((price) => ({
            priceId: price.priceId,
            amountSubtotal: price.amountSubtotal,
            amountTax: price.amountTax,
            amountTotal: price.amountTotal,
            duration: price.duration,
        })),
        badges: cafe.badges.map((badge) => ({
            badgeId: badge.badgeId,
            title: badge.title,
            bgColor: badge.bgColor,
            txtColor: badge.txtColor,
        })),
        seatSummary: buildSeatSummary(cafe),
    };
}

function buildSeatSummary(cafe: Cafe): CafeSeatSummary {
    const totalSeats = cafe.seats.length;
    const availableSeats = cafe.seats.filter(
        (seat) => seat.state === SeatState.AVAILABLE,
    ).length;
    const usageRate = totalSeats > 0
        ? Math.round(((totalSeats - availableSeats) / totalSeats) * 10000) / 100
        : 0;

    return { totalSeats, availableSeats, usageRate };
}

export class CafeSeatDetail {
    seatId: number;
    seatName: string;
    state: string;
    location: string;
    seatType: string;
    seatNumber: number;
}

export class CafeDetailResponse extends CafeResponse {
    seats: CafeSeatDetail[];
}

export function transformToDetailResponse(cafe: Cafe): CafeDetailResponse {
    return {
        ...transformToResponse(cafe),
        seats: cafe.seats.map((seat) => ({
            seatId: seat.seatId,
            seatName: seat.seatName,
            state: seat.state,
            location: seat.location,
            seatType: seat.seatType,
            seatNumber: seat.seatNumber,
        })),
    };
}

export class CafePriceResponse {
    priceId: number;
    cafeId: number;
    amountSubtotal: number;
    amountTax: number;
    amountTotal: number;
}