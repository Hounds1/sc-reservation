export type CafeImage = {
    imageId: number;
    imageSrc: string;
    originName: string;
    identifiedName: string;
    extension: string;
};

export type CafePrice = {
    priceId: number;
    amountSubtotal: number;
    amountTax: number;
    amountTotal: number;
    duration?: number;
};

export type CafeBadge = {
    badgeId: number;
    title: string;
    bgColor: string;
    txtColor: string;
};

export type CafeSeatSummary = {
    totalSeats: number;
    availableSeats: number;
    usageRate: number;
};

export type CafeResponse = {
    cafeId: number;
    businessName: string;
    address1: string;
    address2: string;
    createdAt: number;
    updatedAt: number | null;
    images: CafeImage[];
    prices: CafePrice[];
    badges: CafeBadge[];
    seatSummary: CafeSeatSummary;
};
