import { Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class StorageService {
  private readonly BASE_PATH = path.join(process.cwd(), 'storage');

  async saveFileInPath(
    multerFile: Express.Multer.File,
    subPath: string,
    identifiedName: string,
  ): Promise<string> {
    const relativePath = path.posix.join(subPath.replace(/\\/g, '/'), identifiedName);
    const absolutePath = path.join(this.BASE_PATH, subPath, identifiedName);

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });

    if ((multerFile as any).buffer) {
      await fs.writeFile(absolutePath, (multerFile as any).buffer);
      return relativePath;
    }

    if ((multerFile as any).path) {
      await fs.copyFile((multerFile as any).path, absolutePath);
      return relativePath;
    }

    throw new TypeError('Uploaded file has neither path nor buffer.');
  }

  async deleteFile(relativePath: string): Promise<void> {
    const absolutePath = path.join(this.BASE_PATH, relativePath);
    await fs.unlink(absolutePath).catch(() => {});
  }

  async deleteFiles(relativePaths: string[]): Promise<void> {
    await Promise.all(relativePaths.map((relativePath) => this.deleteFile(relativePath)));
  }
}

