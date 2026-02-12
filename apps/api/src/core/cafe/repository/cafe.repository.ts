import { Injectable } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Cafe, CafeImage, CafePrice, mapCafeModelToCafeWithImages, mapCafeModelToCafeWithPrices, mapCafeModelToCafeWithPricesAndImages, transformToCafeImage } from "../domain/cafe";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";

@Injectable()
export class CafeRepository {

    constructor(private readonly prismaConnector: PrismaConnector) { }

    async createCafe(cafe: Cafe): Promise<Cafe> {
        const result = await this.prismaConnector.$transaction(async (tx) => {
            const createdCafe = await tx.cafes.create({
                data: {
                    business_name: cafe.businessName,
                    address1: cafe.address1,
                    address2: cafe.address2,
                    created_at: BigInt(cafe.createdAt),
                    updated_at: cafe.updatedAt != null ? BigInt(cafe.updatedAt) : null,
                },
            });

            if (cafe.images.length > 0) {
                await tx.cafe_images.createMany({
                    data: cafe.images.map((image) => ({
                        cafe_id: createdCafe.cafe_id,
                        image_src: image.imageSrc,
                        origin_name: image.originName,
                        identified_name: image.identifiedName,
                        extension: image.extension,
                    })),
                });
            }

            const createdImages = await tx.cafe_images.findMany({
                where: { cafe_id: createdCafe.cafe_id },
            });

            return { createdCafe, createdImages };
        });

        return mapCafeModelToCafeWithImages(result.createdCafe, result.createdImages);
    }

    async updateCafe(cafe: Cafe, deleteImageIds: number[]): Promise<Cafe> {
        const result = await this.prismaConnector.$transaction(async (tx) => {
            const updatedCafe = await tx.cafes.update({
                where: { cafe_id: cafe.cafeId },
                data: {
                    ...(cafe.businessName != null && { business_name: cafe.businessName }),
                    ...(cafe.address1 != null && { address1: cafe.address1 }),
                    ...(cafe.address2 != null && { address2: cafe.address2 }),
                    updated_at: BigInt(DatetimeProvider.now()),
                },
            });

            if (deleteImageIds.length > 0) {
                await tx.cafe_images.deleteMany({
                    where: { cafe_id: cafe.cafeId, image_id: { in: deleteImageIds } },
                });
            }

            const newImagesOnly = cafe.images.filter((img) => img.imageId == null);
            if (newImagesOnly.length > 0) {
                await tx.cafe_images.createMany({
                    data: newImagesOnly.map((img) => ({
                        cafe_id: updatedCafe.cafe_id,
                        image_src: img.imageSrc,
                        origin_name: img.originName,
                        identified_name: img.identifiedName,
                        extension: img.extension,
                    }
                    ))
                });
            }

            const images = await tx.cafe_images.findMany({
                where: { cafe_id: updatedCafe.cafe_id }
            });

            return { updatedCafe, images };
        });

        return mapCafeModelToCafeWithImages(result.updatedCafe, result.images);
    }

    async createCafePrices(prices: CafePrice[]): Promise<Cafe> {
        const result = await this.prismaConnector.$transaction(async (tx) => {
            await tx.prices.createMany({
                data: prices.map((price) => ({
                    cafe_id: price.cafeId,
                    amount_subtotal: price.amountSubtotal,
                    amount_tax: price.amountTax,
                    amount_total: price.amountTotal,
                    duration: price.duration,
                })),
            });


            const cafe = await tx.cafes.findUnique({
                where: { cafe_id: prices[0].cafeId },
                include: {
                    prices: true,
                },
            });

            return cafe;
        });

        return mapCafeModelToCafeWithPrices(result, result.prices);
    }

    async selectCafeById(cafeId: number): Promise<Cafe> {
        const result = await this.prismaConnector.cafes.findUnique({
            where: { cafe_id: cafeId },
            include: {
                images: true,
                prices: true,
            },
        });

        return mapCafeModelToCafeWithPricesAndImages(result, result.images, result.prices);
    }

    async selectCafeImagesByCafeId(cafeId: number): Promise<CafeImage[]> {
        const result = await this.prismaConnector.cafe_images.findMany({
            where: { cafe_id: cafeId },
        });

        return result.map(transformToCafeImage);
    }

    async selectCafes(): Promise<Cafe[]> {
        const result = await this.prismaConnector.cafes.findMany({
            include: {
                images: true,
                prices: true,
            },
        });

        return result.map((cafe) => mapCafeModelToCafeWithPricesAndImages(cafe, cafe.images, cafe.prices));
    }
}