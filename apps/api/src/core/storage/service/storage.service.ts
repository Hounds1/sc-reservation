import { Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class StorageService {
    private readonly BASE_PATH = path.join(process.cwd(), 'src', 'io', 'storage');

    async saveFileInPath(
        multerFile: Express.Multer.File,
        subPath: string,
        identifiedName: string
    ) : Promise<string> {
        const filePath = path.join(this.BASE_PATH, subPath, identifiedName);

        await fs.mkdir(path.dirname(filePath), { recursive: true });

        if ((multerFile as any).buffer) {
            await fs.writeFile(filePath, (multerFile as any).buffer);
            return filePath;
        }

        if ((multerFile as any).path) {
            await fs.copyFile((multerFile as any).path, filePath);
            return filePath;
        }

        throw new TypeError('Uploaded file has neither path nor buffer.');
    }

    async deleteFile(filePath: string) : Promise<void> {
        await fs.unlink(filePath).catch(() => {});
    }

    async deleteFiles(filePaths: string[]) : Promise<void> {
        await Promise.all(filePaths.map(filePath => this.deleteFile(filePath)));
    }
}

