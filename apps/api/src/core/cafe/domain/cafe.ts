import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { CafeCreateRequestWithImages } from "./request/cafe.request";
import { cafe_imagesModel, cafesModel, pricesModel } from "generated/prisma/models";

export class Cafe {
    cafeId: number;
    businessName: string;
    address1: string;
    address2: string;
    createdAt: number;
    updatedAt: number | null;
    images: CafeImage[];
    prices: CafePrice[];
}

export class CafeImage {
    imageId: number;
    imageSrc: string;
    originName: string;
    identifiedName: string;
    extension: string;
}

export class CafePrice {
    priceId: number;
    cafeId: number;
    amountSubtotal: number;
    amountTax: number;
    amountTotal: number;
    duration: number; // 이용
}

export function transformToCafeImage(image: cafe_imagesModel): CafeImage {
    return {
        imageId: Number(image.image_id),
        imageSrc: image.image_src,
        originName: image.origin_name,
        identifiedName: image.identified_name,
        extension: image.extension,
    }
}

export function transformToEntity(request: CafeCreateRequestWithImages): Cafe {
    return {
        cafeId: null,
        businessName: request.businessName,
        address1: request.address1,
        address2: request.address2,
        createdAt: DatetimeProvider.now(),
        updatedAt: null,
        images: request.images.map((image) => ({
            imageId: null,
            imageSrc: image.path,
            originName: image.originalname,
            identifiedName: image.filename,
            extension: image.mimetype.split('/')[1] || '',
        })),
        prices: [],
    }
}


export function mapCafeModelToCafe(prismaCafe: cafesModel): Cafe {
    return {
        cafeId: Number(prismaCafe.cafe_id),
        businessName: prismaCafe.business_name,
        address1: prismaCafe.address1,
        address2: prismaCafe.address2,
        createdAt: Number(prismaCafe.created_at),
        updatedAt: prismaCafe.updated_at ? Number(prismaCafe.updated_at) : null,
        images: [],
        prices: [],
    };
}

export function mapCafeModelToCafeWithImages(
    prismaCafe: cafesModel,
    prismaImages: cafe_imagesModel[],
): Cafe {
    return {
        ...mapCafeModelToCafe(prismaCafe),
        images: prismaImages.map((img) => ({
            imageId: Number(img.image_id),
            imageSrc: img.image_src,
            originName: img.origin_name,
            identifiedName: img.identified_name,
            extension: img.extension,
        })),
        prices: [],
    };
}

export function mapCafeModelToCafeWithPrices(
    prismaCafe: cafesModel,
    prismaPrices: pricesModel[],
): Cafe {
    return {
        ...mapCafeModelToCafe(prismaCafe),
        prices: prismaPrices.map((price) => ({
            priceId: Number(price.price_id),
            cafeId: Number(price.cafe_id),
            amountSubtotal: Number(price.amount_subtotal),
            amountTax: Number(price.amount_tax),
            amountTotal: Number(price.amount_total),
            duration: Number(price.duration),
        })),
    };
}

export function mapCafeModelToCafeWithPricesAndImages(
    prismaCafe: cafesModel,
    prismaImages: cafe_imagesModel[],
    prismaPrices: pricesModel[],
): Cafe {
    return {
        ...mapCafeModelToCafeWithPrices(prismaCafe, prismaPrices),
        images: prismaImages.map((img) => ({
            imageId: Number(img.image_id),
            imageSrc: img.image_src,
            originName: img.origin_name,
            identifiedName: img.identified_name,
            extension: img.extension,
        })),
        prices: prismaPrices.map((price) => ({
            priceId: Number(price.price_id),
            cafeId: Number(price.cafe_id),
            amountSubtotal: Number(price.amount_subtotal),
            amountTax: Number(price.amount_tax),
            amountTotal: Number(price.amount_total),
            duration: Number(price.duration),
        })),
    };
}
