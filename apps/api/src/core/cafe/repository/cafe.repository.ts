import { Injectable } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Cafe, mapCafeModelToCafeWithImages } from "../domain/cafe";

@Injectable()
export class CafeRepository {

    constructor(private readonly prismaConnector: PrismaConnector) {}

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
}