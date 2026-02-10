import { Cafe } from "../cafe";

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
    };
}