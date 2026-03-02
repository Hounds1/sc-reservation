import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CafeRepository } from "../repository/cafe.repository";
import { CafeBadgeCreateRequest, CafeCreateRequestWithImages, CafeModifyRequestWithImages, CafePriceCreateRequest } from "../domain/request/cafe.request";
import { Cafe, CafeBadge, CafePrice, transformToEntity } from "../domain/cafe";
import { CafeDetailResponse, CafePriceResponse, CafeResponse, transformToDetailResponse, transformToResponse } from "../domain/response/cafe.response";
import { StorageService } from "../../storage/service/storage.service";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { TransactionManager } from "src/global/prisma/transaction.manager";

@Injectable()
export class CafeService {

  private readonly CAFE_IMAGE_PATH = 'cafe';

  constructor(
    private readonly cafeRepository: CafeRepository,
    private readonly storageService: StorageService,
    private readonly txManager: TransactionManager,
  ) { }

  async createCafe(request: CafeCreateRequestWithImages): Promise<CafeResponse> {
    const savedPaths: string[] = [];

    try {
      const imagesWithPaths = await Promise.all(
        request.images.map(async (multerFile, index) => {
          const ext = multerFile.mimetype.split('/')[1] || 'jpg';
          const filename = `${DatetimeProvider.now()}-${index}-${crypto.randomUUID()}.${ext}`;
          const savedPath = await this.storageService.saveFileInPath(
            multerFile,
            this.CAFE_IMAGE_PATH,
            filename,
          );
          savedPaths.push(savedPath);
          return {
            imageId: null,
            imageSrc: savedPath,
            originName: multerFile.originalname,
            identifiedName: filename,
            extension: ext,
          };
        }),
      );

      const cafeEntity: Cafe = {
        cafeId: null,
        businessName: request.businessName,
        address1: request.address1,
        address2: request.address2,
        createdAt: DatetimeProvider.now(),
        updatedAt: null,
        images: imagesWithPaths,
        prices: [],
        badges: [],
        seats: [],
      };

      const createdCafe = await this.txManager.run(async () => {
        return this.cafeRepository.createCafe(cafeEntity);
      });

      return transformToResponse(createdCafe);
    } catch (error) {
      if (savedPaths.length > 0) await this.storageService.deleteFiles(savedPaths);
      throw error;
    }
  }

  async modifyCafe(request: CafeModifyRequestWithImages): Promise<CafeResponse> {
    const savedPaths: string[] = [];

    try {
      const presentImages = await this.cafeRepository.selectCafeImagesByCafeId(request.cafeId);
      const deleteImageIds = request.deleteImageIds ?? [];
      const newImages = request.images ?? [];

      const deleteIdSet = new Set(deleteImageIds);
      const keptCount = presentImages.filter((img) => !deleteIdSet.has(img.imageId)).length;
      const addedCount = newImages.length;
      const totalCount = keptCount + addedCount;

      if (totalCount < 1) throw new BadRequestException('이미지는 최소 1개 이상이어야 합니다.');

      const filePathsToDelete = presentImages
        .filter((img) => deleteIdSet.has(img.imageId))
        .map((img) => img.imageSrc);

      const imagesWithPaths = await Promise.all(
        request.images.map(async (multerFile, index) => {
          const ext = multerFile.mimetype.split('/')[1] || 'jpg';
          const filename = `${DatetimeProvider.now()}-${index}-${crypto.randomUUID()}.${ext}`;
          const savedPath = await this.storageService.saveFileInPath(
            multerFile,
            this.CAFE_IMAGE_PATH,
            filename,
          );
          savedPaths.push(savedPath);
          return {
            imageId: null,
            imageSrc: savedPath,
            originName: multerFile.originalname,
            identifiedName: filename,
            extension: ext,
          };
        }),
      );

      const cafe = await this.cafeRepository.selectCafeById(request.cafeId);
      if (!cafe) throw new NotFoundException(`카페(ID: ${request.cafeId})를 찾을 수 없습니다.`);
      Object.assign(cafe, {
        ...(request.businessName != null && { businessName: request.businessName }),
        ...(request.address1 != null && { address1: request.address1 }),
        ...(request.address2 != null && { address2: request.address2 }),
      });
      cafe.images = cafe.images.filter((img) => !deleteIdSet.has(img.imageId)).concat(imagesWithPaths);

      const updatedCafe = await this.txManager.run(async () => {
        return this.cafeRepository.updateCafe(cafe, deleteImageIds);
      });

      await this.storageService.deleteFiles(filePathsToDelete);

      return transformToResponse(updatedCafe);
    } catch (error) {
      if (savedPaths.length > 0) await this.storageService.deleteFiles(savedPaths);
      throw error;
    }
  }

  async createCafePrice(request: CafePriceCreateRequest[]): Promise<CafeResponse> {
    const prices = request.map((price) => {
      const transformedPrice: CafePrice = {
        priceId: null,
        cafeId: price.cafeId,
        amountSubtotal: price.amountSubtotal,
        amountTax: price.amountTax,
        amountTotal: price.amountTotal,
        duration: price.duration,
      };
      return transformedPrice;
    });

    const cafeWithPrices = await this.txManager.run(async () => {
      return this.cafeRepository.createCafePrices(prices);
    });

    return transformToResponse(cafeWithPrices);
  }

  async createCafeBadge(request: CafeBadgeCreateRequest[]): Promise<CafeResponse> {
    const badges = request.map((badge) => {
      const transformedBadge: CafeBadge = {
        badgeId: null,
        cafeId: badge.cafeId,
        title: badge.title,
        bgColor: badge.bgColor,
        txtColor: badge.txtColor,
      };
      return transformedBadge;
    });

    const cafeWithBadges = await this.txManager.run(async () => {
      return this.cafeRepository.createCafeBadges(badges);
    });

    return transformToResponse(cafeWithBadges);
  }

  async getAllCafes(): Promise<CafeResponse[]> {
    const cafes = await this.cafeRepository.selectCafes();
    return cafes.map(transformToResponse);
  }

  async getCafeById(cafeId: number): Promise<CafeResponse> {
    const cafe = await this.cafeRepository.selectCafeById(cafeId);
    if (!cafe) throw new NotFoundException(`카페(ID: ${cafeId})를 찾을 수 없습니다.`);
    return transformToResponse(cafe);
  }

  async getCafeDetailById(cafeId: number): Promise<CafeDetailResponse> {
    const cafe = await this.cafeRepository.selectCafeById(cafeId);
    if (!cafe) throw new NotFoundException(`카페(ID: ${cafeId})를 찾을 수 없습니다.`);
    return transformToDetailResponse(cafe);
  }
}
