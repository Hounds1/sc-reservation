import { Injectable } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Cafe, CafeBadge, CafeImage, CafePrice, mapCafeModelToCafeWithAllElements, mapCafeModelToCafeWithBadges, mapCafeModelToCafeWithImages, mapCafeModelToCafeWithPrices, transformToCafeImage } from "../domain/cafe";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";

@Injectable()
export class CafeRepository {

    constructor(private readonly prismaConnector: PrismaConnector) { }

    async createCafe(cafe: Cafe): Promise<Cafe> {
        const client = this.prismaConnector.getClient();

        const createdCafe = await client.cafes.create({
            data: {
                business_name: cafe.businessName,
                address1: cafe.address1,
                address2: cafe.address2,
                created_at: BigInt(cafe.createdAt),
                updated_at: cafe.updatedAt != null ? BigInt(cafe.updatedAt) : null,
            },
        });

        if (cafe.images.length > 0) {
            await client.cafe_images.createMany({
                data: cafe.images.map((image) => ({
                    cafe_id: createdCafe.cafe_id,
                    image_src: image.imageSrc,
                    origin_name: image.originName,
                    identified_name: image.identifiedName,
                    extension: image.extension,
                })),
            });
        }

        const createdImages = await client.cafe_images.findMany({
            where: { cafe_id: createdCafe.cafe_id },
        });

        return mapCafeModelToCafeWithImages(createdCafe, createdImages);
    }

    async updateCafe(cafe: Cafe, deleteImageIds: number[]): Promise<Cafe> {
        const client = this.prismaConnector.getClient();

        const updatedCafe = await client.cafes.update({
            where: { cafe_id: cafe.cafeId },
            data: {
                ...(cafe.businessName != null && { business_name: cafe.businessName }),
                ...(cafe.address1 != null && { address1: cafe.address1 }),
                ...(cafe.address2 != null && { address2: cafe.address2 }),
                updated_at: BigInt(DatetimeProvider.now()),
            },
        });

        if (deleteImageIds.length > 0) {
            await client.cafe_images.deleteMany({
                where: { cafe_id: cafe.cafeId, image_id: { in: deleteImageIds } },
            });
        }

        const newImagesOnly = cafe.images.filter((img) => img.imageId == null);
        if (newImagesOnly.length > 0) {
            await client.cafe_images.createMany({
                data: newImagesOnly.map((img) => ({
                    cafe_id: updatedCafe.cafe_id,
                    image_src: img.imageSrc,
                    origin_name: img.originName,
                    identified_name: img.identifiedName,
                    extension: img.extension,
                }))
            });
        }

        const images = await client.cafe_images.findMany({
            where: { cafe_id: updatedCafe.cafe_id }
        });

        return mapCafeModelToCafeWithImages(updatedCafe, images);
    }

    async createCafePrices(prices: CafePrice[]): Promise<Cafe> {
        const client = this.prismaConnector.getClient();

        await client.prices.createMany({
            data: prices.map((price) => ({
                cafe_id: price.cafeId,
                amount_subtotal: price.amountSubtotal,
                amount_tax: price.amountTax,
                amount_total: price.amountTotal,
                duration: price.duration,
            })),
        });

        const cafe = await client.cafes.findUnique({
            where: { cafe_id: prices[0].cafeId },
            include: {
                prices: true,
            },
        });

        return mapCafeModelToCafeWithPrices(cafe, cafe.prices);
    }

    async createCafeBadges(badges: CafeBadge[]): Promise<Cafe> {
        const client = this.prismaConnector.getClient();

        await client.badges.createMany({
            data: badges.map((badge) => ({
                cafe_id: badge.cafeId,
                title: badge.title,
                bg_color: badge.bgColor,
                txt_color: badge.txtColor,
            })),
        });

        const cafe = await client.cafes.findUnique({
            where: { cafe_id: badges[0].cafeId },
            include: {
                badges: true,
            },
        });

        return mapCafeModelToCafeWithBadges(cafe, cafe.badges);
    }

    async selectCafeById(cafeId: number): Promise<Cafe> {
        const client = this.prismaConnector.getClient();

        const result = await client.cafes.findUnique({
            where: { cafe_id: cafeId },
            include: {
                images: true,
                prices: true,
                badges: true,
                seats: true,
            },
        });

        return mapCafeModelToCafeWithAllElements(result, result.images, result.prices, result.badges, result.seats);
    }

    async selectCafeImagesByCafeId(cafeId: number): Promise<CafeImage[]> {
        const client = this.prismaConnector.getClient();

        const result = await client.cafe_images.findMany({
            where: { cafe_id: cafeId },
        });

        return result.map(transformToCafeImage);
    }

    async selectCafes(): Promise<Cafe[]> {
        const client = this.prismaConnector.getClient();

        const result = await client.cafes.findMany({
            include: {
                images: true,
                prices: true,
                badges: true,
                seats: true,
            },
        });

        return result.map((cafe) => mapCafeModelToCafeWithAllElements(cafe, cafe.images, cafe.prices, cafe.badges, cafe.seats));
    }
}
