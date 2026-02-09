import { BadRequestException, Injectable } from "@nestjs/common";
import { CafeRepository } from "../repository/cafe.repository";
import { CafeCreateRequestWithImages, CafeModifyRequestWithImages } from "../domain/request/cafe.request";
import { Cafe, transformToEntity } from "../domain/cafe";
import { CafeResponse, transformToResponse } from "../domain/response/cafe.response";
import { StorageService } from "../../storage/service/storage.service";
import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";

@Injectable()
export class CafeService {

  private readonly CAFE_IMAGE_PATH = 'cafe';

  constructor(private readonly cafeRepository: CafeRepository, private readonly storageService: StorageService) { }

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
      };

      const createdCafe = await this.cafeRepository.createCafe(cafeEntity);

      return transformToResponse(createdCafe);
    } catch (error) {
      // 실패하거나 트랜잭션 터졌을 때 보상 개념 << 보상 :: 상 주는거 아님. 잘못된 부분 메꾸는 행위
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
      Object.assign(cafe, {
        ...(request.businessName != null && { businessName: request.businessName }),
        ...(request.address1 != null && { address1: request.address1 }),
        ...(request.address2 != null && { address2: request.address2 }),
      });
      cafe.images = cafe.images.filter((img) => !deleteIdSet.has(img.imageId)).concat(imagesWithPaths);

      const updatedCafe = await this.cafeRepository.updateCafe(cafe, deleteImageIds);

      await this.storageService.deleteFiles(filePathsToDelete);

      return transformToResponse(updatedCafe);
    } catch (error) {
      if (savedPaths.length > 0) await this.storageService.deleteFiles(savedPaths);
      throw error;
    }
  }

}